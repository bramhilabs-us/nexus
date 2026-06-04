# 🚀 KARVIA OKR - BETA RELEASE STRATEGY

**Version**: 1.0
**Date**: October 1, 2025
**Target Release**: Q1 2026 (Post-MVP)
**Scope**: Complete end-to-end OKR platform with advanced features

---

## 📋 OVERVIEW

This document contains all features deferred from MVP (Nov 30, 2025) to create a complete, enterprise-ready OKR platform for Beta Release in Q1 2026.

**Beta Vision**: Transform Karvia from MVP (core OKR flow) into a comprehensive business execution platform with advanced AI, deep analytics, integrations, and white-label capabilities.

---

## 🎯 BETA RELEASE PHASES

### **Phase 1: Enhanced Assessment System** (4 weeks)
- Advanced assessment templates
- Custom template builder
- Template marketplace
- Multi-framework assessments

### **Phase 2: Advanced Analytics & Insights** (4 weeks)
- Sentiment analysis & reflection system
- Predictive analytics
- Advanced dashboards
- Health indicators

### **Phase 3: Collaboration & Integrations** (4 weeks)
- Team collaboration features
- External tool integrations
- Mobile apps
- Communication features

### **Phase 4: Enterprise Features** (4 weeks)
- Granular permissions
- Sub-teams and hierarchies
- White-label advanced features
- Advanced consultant tools

### **Phase 5: Platform & AI Enhancements** (4 weeks)
- Advanced AI capabilities
- Custom formula engine
- Automation & workflows
- Performance optimization

---

## 📊 PHASE 1: ENHANCED ASSESSMENT SYSTEM (4 Weeks)

### **1.1 Five Additional Pre-Built Assessment Templates**

**Add to existing Speed/Strength/Intelligence template:**

#### **A. Balanced Scorecard Framework**
```javascript
{
  id: "balanced_scorecard",
  name: "Balanced Scorecard Assessment",
  description: "Evaluate business across 4 perspectives",
  version: "1.0",
  categories: [
    {
      id: "financial",
      name: "Financial Perspective",
      weight: 25,
      questions: [
        "How effectively do you track revenue growth?",
        "Is cash flow visibility strong?",
        // ... 8-10 questions
      ]
    },
    {
      id: "customer",
      name: "Customer Perspective",
      weight: 25,
      questions: [
        "How satisfied are your customers?",
        "Do you measure customer retention?",
        // ... 8-10 questions
      ]
    },
    {
      id: "internal_processes",
      name: "Internal Business Processes",
      weight: 25,
      questions: [
        "Are your operations documented?",
        "How efficient are core processes?",
        // ... 8-10 questions
      ]
    },
    {
      id: "learning_growth",
      name: "Learning & Growth",
      weight: 25,
      questions: [
        "Do employees have growth plans?",
        "Is innovation encouraged?",
        // ... 8-10 questions
      ]
    }
  ],
  calculationMethod: "weighted_average"
}
```

#### **B. McKinsey 7S Framework**
```javascript
{
  id: "mckinsey_7s",
  name: "McKinsey 7S Assessment",
  description: "Evaluate organizational effectiveness across 7 elements",
  categories: [
    { id: "strategy", name: "Strategy", weight: 14.3 },
    { id: "structure", name: "Structure", weight: 14.3 },
    { id: "systems", name: "Systems", weight: 14.3 },
    { id: "shared_values", name: "Shared Values", weight: 14.3 },
    { id: "style", name: "Leadership Style", weight: 14.3 },
    { id: "staff", name: "Staff", weight: 14.3 },
    { id: "skills", name: "Skills", weight: 14.4 }
  ],
  calculationMethod: "weighted_average"
}
```

#### **C. Startup Health Check**
```javascript
{
  id: "startup_health",
  name: "Startup Health Assessment",
  description: "Evaluate startup maturity and readiness",
  categories: [
    { id: "product_market_fit", name: "Product-Market Fit", weight: 30 },
    { id: "team_capabilities", name: "Team Capabilities", weight: 25 },
    { id: "financial_runway", name: "Financial Runway", weight: 20 },
    { id: "go_to_market", name: "Go-to-Market", weight: 15 },
    { id: "technology_infrastructure", name: "Technology Infrastructure", weight: 10 }
  ],
  calculationMethod: "weighted_average"
}
```

#### **D. Service Business Maturity**
```javascript
{
  id: "service_business_maturity",
  name: "Service Business Maturity Model",
  description: "For consulting, agency, professional services firms",
  categories: [
    { id: "client_acquisition", name: "Client Acquisition", weight: 20 },
    { id: "delivery_excellence", name: "Delivery Excellence", weight: 25 },
    { id: "team_utilization", name: "Team Utilization", weight: 15 },
    { id: "financial_predictability", name: "Financial Predictability", weight: 20 },
    { id: "brand_reputation", name: "Brand & Reputation", weight: 10 },
    { id: "systems_scalability", name: "Systems Scalability", weight: 10 }
  ],
  calculationMethod: "weighted_average"
}
```

#### **E. E-commerce Readiness**
```javascript
{
  id: "ecommerce_readiness",
  name: "E-commerce Readiness Assessment",
  description: "For online retail and D2C businesses",
  categories: [
    { id: "product_catalog", name: "Product Catalog & Inventory", weight: 15 },
    { id: "website_ux", name: "Website UX & Conversion", weight: 25 },
    { id: "marketing_acquisition", name: "Marketing & Acquisition", weight: 20 },
    { id: "fulfillment_logistics", name: "Fulfillment & Logistics", weight: 20 },
    { id: "customer_service", name: "Customer Service", weight: 10 },
    { id: "data_analytics", name: "Data & Analytics", weight: 10 }
  ],
  calculationMethod: "weighted_average"
}
```

**Implementation:**
- [ ] Create template JSON definitions in `/server/data/assessment_templates/`
- [ ] Add template selection UI in owner assessment flow
- [ ] Store selected template ID in Business model
- [ ] Display template-specific results visualization

**Acceptance Criteria:**
- Admin can select from 6 assessment templates
- Each template generates appropriate category scores
- OKR generation considers category scores from any template

---

### **1.2 Custom Assessment Template Builder**

**UI Flow:**

1. **Template Creation Screen** (`admin_create_template.html`)
   - Template name, description
   - Add category (name, weight %)
   - Validation: Total weight = 100%

2. **Question Builder** (`admin_template_questions.html`)
   - Drag-and-drop question ordering
   - Question types:
     - Multiple choice (1-5 scale)
     - Yes/No
     - Text input
     - Slider (0-100)
   - Assign questions to categories
   - Set question weights within category

3. **Template Preview** (`admin_template_preview.html`)
   - Test assessment flow
   - See sample score calculation
   - Publish template

**Data Model:**
```javascript
// CustomAssessmentTemplate Model
{
  id: ObjectId,
  created_by: ObjectId (ref User - must be Company Admin or Consultant),
  business_id: ObjectId (template owned by company),
  name: String,
  description: String,
  version: String (1.0, 1.1, etc.),
  status: enum('draft', 'published', 'archived'),
  visibility: enum('private', 'company', 'marketplace'),

  categories: [
    {
      id: String,
      name: String,
      description: String,
      weight: Number (percentage),
      questions: [
        {
          id: String,
          text: String,
          question_type: enum('scale_1_5', 'yes_no', 'text', 'slider'),
          weight: Number (within category),
          options: Array (for multiple choice),
          scoring_map: Object ({ '1': 20, '2': 40, ... } for scale questions)
        }
      ]
    }
  ],

  calculation_method: enum('weighted_average', 'custom_formula'),
  custom_formula: String (if calculation_method = 'custom_formula'),

  usage_count: Number,
  average_rating: Number (if in marketplace),

  created_at: Date,
  updated_at: Date
}
```

**API Endpoints:**
```javascript
// Template Management
POST   /api/assessment/templates                  // Create template
GET    /api/assessment/templates                  // List templates (owned + public)
GET    /api/assessment/templates/:id              // Get template details
PUT    /api/assessment/templates/:id              // Update template
DELETE /api/assessment/templates/:id              // Delete template
PUT    /api/assessment/templates/:id/publish      // Publish template
POST   /api/assessment/templates/:id/duplicate    // Duplicate template

// Question Management
POST   /api/assessment/templates/:id/questions    // Add question
PUT    /api/assessment/templates/:id/questions/:qid  // Update question
DELETE /api/assessment/templates/:id/questions/:qid  // Delete question
POST   /api/assessment/templates/:id/questions/reorder  // Reorder questions
```

**Acceptance Criteria:**
- Admin can create custom template with 3-10 categories
- Add 5-50 questions per template
- Preview template before publishing
- Use custom template for assessments
- OKR generation works with custom templates

---

### **1.3 Custom Formula Editor (Advanced Calculation)**

**MVP ships weighted average only. Beta adds custom formulas.**

**UI Flow:**

1. **Formula Editor** (`admin_formula_editor.html`)
   - Category variable picker (e.g., `speed`, `strength`, `intelligence`)
   - Mathematical operators (+, -, *, /, ^, sqrt, min, max, avg)
   - Conditional logic (if/else)
   - Formula validator (syntax check + test calculation)

**Example Formulas:**
```javascript
// Weighted with penalties
overall_score = (speed * 0.4 + strength * 0.3 + intelligence * 0.3) - (speed < 50 ? 10 : 0)

// Minimum threshold required
overall_score = min(speed, strength, intelligence) >= 60 ? avg(speed, strength, intelligence) : 0

// Exponential emphasis
overall_score = sqrt(speed * strength * intelligence) / 10

// Conditional weighting
overall_score = intelligence > 80 ? (intelligence * 0.5 + speed * 0.3 + strength * 0.2) : avg(speed, strength, intelligence)
```

**Implementation:**
```javascript
// Formula Engine
class FormulaEngine {
  validateFormula(formula, categories) {
    // 1. Parse formula into AST
    // 2. Check syntax
    // 3. Validate category names exist
    // 4. Test with sample values
    // 5. Check for infinite loops, division by zero
    return { valid: true/false, error: String }
  }

  calculateScore(formula, categoryScores) {
    // 1. Sanitize formula (prevent code injection)
    // 2. Replace category names with values
    // 3. Execute in sandboxed environment (VM2 or mathjs)
    // 4. Return calculated score
    return Number (0-100)
  }
}
```

**Security:**
- **Sandboxed execution** (VM2 library or mathjs safe evaluation)
- No access to Node.js internals, require(), filesystem
- Timeout after 100ms (prevent infinite loops)
- Formula length limit: 500 characters

**Acceptance Criteria:**
- Admin can write custom formula using category variables
- Formula validator catches syntax errors
- Test with sample scores before saving
- Formula applied correctly during assessment scoring
- No security vulnerabilities (injection, timeout)

---

### **1.4 Assessment Template Marketplace**

**Vision**: Consultants and experts create/sell premium assessment templates

**Features:**

1. **Marketplace Listing** (`marketplace_templates.html`)
   - Browse public templates (free + paid)
   - Filter by industry, framework, rating
   - Preview template (categories, sample questions)
   - Purchase/install template

2. **Template Details Page** (`marketplace_template_detail.html`)
   - Template overview (author, description, rating)
   - Sample results visualization
   - User reviews
   - Usage statistics (X companies using this)
   - "Install Template" button

3. **Consultant Template Publishing**
   - Set price ($0 = free, $X = paid)
   - Revenue share: Karvia 30%, Author 70%
   - Review & approval process (Karvia team reviews before publish)

**Data Model:**
```javascript
// Extend CustomAssessmentTemplate
{
  marketplace_listing: {
    is_listed: Boolean,
    price: Number (USD, 0 = free),
    listing_date: Date,
    total_installs: Number,
    average_rating: Number,
    reviews: [
      {
        user_id: ObjectId,
        rating: Number (1-5),
        comment: String,
        date: Date
      }
    ],
    revenue_generated: Number,
    approval_status: enum('pending', 'approved', 'rejected'),
    rejection_reason: String
  }
}

// TemplatePurchase Model
{
  id: ObjectId,
  template_id: ObjectId,
  buyer_business_id: ObjectId,
  buyer_user_id: ObjectId,
  price_paid: Number,
  purchase_date: Date,
  stripe_payment_id: String
}
```

**API Endpoints:**
```javascript
GET  /api/marketplace/templates              // List marketplace templates
GET  /api/marketplace/templates/:id          // Template details
POST /api/marketplace/templates/:id/install  // Install template
POST /api/marketplace/templates/:id/review   // Add review
GET  /api/marketplace/my-templates           // Consultant: my published templates
PUT  /api/marketplace/templates/:id/list     // List template in marketplace
```

**Monetization:**
- Stripe integration for paid templates
- Consultant dashboard: earnings, installs, reviews
- Karvia admin: review pending templates

**Acceptance Criteria:**
- Consultants can list templates (free or paid)
- Companies can browse and install marketplace templates
- Payment processing works (Stripe)
- Revenue share tracked correctly
- Template reviews and ratings displayed

---

## 📊 PHASE 2: ADVANCED ANALYTICS & INSIGHTS (4 Weeks)

### **2.1 Sentiment Analysis & Reflection System**

**Inspired by `post_implementation_checklist_karviaokr.md` (Lines 17-42)**

#### **A. Dual Sentiment Circles Dashboard**

Replace "Manager Focus Today" with:
- **Individual Sentiment Circle** (left)
  - User's personal sentiment score (0-100)
  - Color-coded: Green (80+), Yellow (50-79), Red (<50)
  - Emoji indicator
  - Trend arrow (↑↓→)

- **Team Sentiment Circle** (right)
  - Average team sentiment (for managers/admins)
  - Individual sentiment for employees
  - Number of team members below threshold
  - "Check in with team" CTA if low

**Data Model:**
```javascript
// DailySentiment Model
{
  id: ObjectId,
  user_id: ObjectId,
  business_id: ObjectId,
  date: Date,
  sentiment_score: Number (0-100),
  sentiment_category: enum('very_low', 'low', 'neutral', 'good', 'excellent'),

  // Derived from reflection
  reflection_text: String,
  key_wins: Array<String>,
  challenges: Array<String>,
  support_needed: Boolean,

  // Calculated
  tasks_completed_today: Number,
  tasks_pending: Number,
  objectives_on_track: Number,

  created_at: Date
}
```

#### **B. Reflection Collection Feature**

**UI Flow** (Lines 33-42 of post_implementation_checklist):

1. **Green + Button** (bottom-right corner after 4th task tile)
   - Appears after completing 3+ tasks OR at end of day
   - Pulsing animation to encourage reflection

2. **Reflection Modal** (`reflection_modal.html`)
   - **Question 1**: "How was your day today?" (1-5 emoji scale)
   - **Question 2**: "What went well?" (text input)
   - **Question 3**: "What challenges did you face?" (text input)
   - **Question 4**: "Do you need support?" (Yes/No + text)
   - **Submit** button (saves reflection, calculates sentiment)

**Sentiment Scoring Algorithm:**
```javascript
class SentimentEngine {
  calculateSentiment(reflection) {
    // 1. Base score from emoji (1 = 20, 2 = 40, 3 = 60, 4 = 80, 5 = 100)
    let score = reflection.emoji_rating * 20;

    // 2. Analyze text (positive/negative keywords)
    const positiveWords = ['great', 'achieved', 'success', 'completed', 'happy', 'progress'];
    const negativeWords = ['stuck', 'blocked', 'frustrated', 'delayed', 'difficult', 'overwhelmed'];

    const winsText = reflection.key_wins.join(' ').toLowerCase();
    const challengesText = reflection.challenges.join(' ').toLowerCase();

    let positiveCount = positiveWords.filter(w => winsText.includes(w)).length;
    let negativeCount = negativeWords.filter(w => challengesText.includes(w)).length;

    // 3. Adjust score
    score += (positiveCount * 2) - (negativeCount * 3);

    // 4. Factor in task completion
    const completionRate = reflection.tasks_completed / (reflection.tasks_completed + reflection.tasks_pending);
    score += (completionRate * 10);

    // 5. Need support reduces score
    if (reflection.support_needed) score -= 5;

    // 6. Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  }

  aggregateTeamSentiment(teamMemberSentiments) {
    // Average team sentiment
    const scores = teamMemberSentiments.map(s => s.sentiment_score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Identify low performers (score < 50)
    const lowSentiment = teamMemberSentiments.filter(s => s.sentiment_score < 50);

    return {
      team_average: average,
      low_sentiment_count: lowSentiment.length,
      team_members_needing_support: lowSentiment.map(s => s.user_id)
    };
  }
}
```

**API Endpoints:**
```javascript
POST /api/reflections                    // Submit daily reflection
GET  /api/reflections/my-history         // My reflection history (last 30 days)
GET  /api/reflections/team-sentiment     // Team sentiment (managers only)
GET  /api/reflections/trends             // Sentiment trends over time
```

**Acceptance Criteria:**
- Reflection modal appears after 3+ tasks completed
- Sentiment score calculated from reflection + task completion
- Individual and team sentiment circles on dashboard
- Manager alerted when team member has low sentiment
- Reflection history viewable (last 30 days)

---

### **2.2 AI Insights - Horizontal Layout**

**From Lines 44-47 of post_implementation_checklist**

**Current MVP**: AI insights displayed vertically (takes up space)

**Beta Enhancement**: Horizontal scrollable carousel

**UI Design:**
```
┌─────────────────────────────────────────────────────────┐
│ 💡 AI Insights                                    › ›   │
├─────────────────────────────────────────────────────────┤
│ [Card 1]        [Card 2]        [Card 3]        [Card 4]│
│ ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐│
│ │Recommend│    │Risk     │    │Optimiz- │    │Predict- ││
│ │ation    │    │Alert    │    │ation    │    │ion      ││
│ │         │    │         │    │         │    │         ││
│ │[Details]│    │[Details]│    │[Details]│    │[Details]││
│ └─────────┘    └─────────┘    └─────────┘    └─────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Horizontal scroll with arrow navigation
- 4-5 insight cards visible at once
- Click card to expand details
- Role-specific insights (manager sees team insights, employee sees personal)
- Swipe gesture support (mobile)

**Acceptance Criteria:**
- AI insights display horizontally (scrollable)
- Better space utilization vs vertical layout
- Maintains role-specific content from MVP

---

### **2.3 Health Indicators Dashboard**

**From Lines 49-53 of post_implementation_checklist**

**Three Perspective Levels:**

1. **Individual Health** (Employee view)
   - Task completion rate (last 7/30 days)
   - Sentiment trend (arrow: ↑↓→)
   - Objectives on track vs at-risk
   - Work-life balance score (derived from task timing, reflection)

2. **Team Health** (Manager view)
   - Team average completion rate
   - Team sentiment distribution (% excellent, good, neutral, low)
   - Objectives progress (Green: on track, Yellow: at risk, Red: blocked)
   - Team members needing attention (low sentiment, blocked tasks)
   - Workload distribution (over/underutilized team members)

3. **Company Health** (Executive/Admin view)
   - Company-wide OKR progress
   - Department comparisons (which teams on track?)
   - Top performers (individuals + teams)
   - Risk areas (objectives falling behind)
   - Assessment score trends (Speed/Strength/Intelligence over time)

**Data Model:**
```javascript
// HealthMetrics Model (aggregated daily)
{
  id: ObjectId,
  date: Date,
  level: enum('individual', 'team', 'company'),
  entity_id: ObjectId (user_id, team_id, business_id),

  metrics: {
    task_completion_rate: Number (percentage),
    sentiment_average: Number (0-100),
    objectives_on_track: Number,
    objectives_at_risk: Number,
    objectives_blocked: Number,
    workload_balance_score: Number (0-100, 100 = perfectly balanced)
  },

  created_at: Date
}
```

**UI Components:**
- Health score cards (color-coded)
- Trend sparklines (7-day mini-chart)
- Traffic light indicators (🟢🟡🔴)
- Drill-down capability (click to see details)

**Acceptance Criteria:**
- Individual health metrics on employee dashboard
- Team health metrics on manager dashboard
- Company health metrics on executive/admin dashboard
- Same data, different perspectives per role
- Real-time updates (daily aggregation)

---

### **2.4 Predictive Analytics**

**AI-Powered Predictions:**

1. **Objective At-Risk Prediction**
   - ML model: Predict if objective will miss deadline
   - Input features: Progress rate, task completion, team sentiment, historical data
   - Output: Risk score (0-100), predicted completion date
   - Alert 2 weeks before deadline if risk > 70%

2. **Team Burnout Prediction**
   - Analyze: Task volume, sentiment trends, work hours (if integrated)
   - Flag: Team members at risk of burnout (sentiment declining, overloaded)
   - Recommend: Task redistribution, additional support

3. **OKR Success Probability**
   - When generating OKRs, predict success probability (Easy: 80%, Medium: 60%, Hard: 40%)
   - Based on: Business archetype, assessment scores, historical success rates

**Data Model:**
```javascript
// Prediction Model
{
  id: ObjectId,
  prediction_type: enum('objective_risk', 'team_burnout', 'okr_success'),
  entity_id: ObjectId (objective_id, user_id, team_id),
  prediction_score: Number (0-100),
  confidence: Number (0-100),
  factors: Array<String> (what influenced prediction),
  recommended_actions: Array<String>,
  created_at: Date,
  expires_at: Date
}
```

**Implementation:**
- Phase 1: Rule-based predictions (simple thresholds)
- Phase 2: ML models (TensorFlow.js or external ML service)
- Phase 3: Continuous learning (improve predictions over time)

**Acceptance Criteria:**
- At-risk objectives flagged 2 weeks before deadline
- Manager sees burnout risk alerts for team members
- OKR generation shows success probability
- Predictions improve over time with more data

---

## 🤝 PHASE 3: COLLABORATION & INTEGRATIONS (4 Weeks)

### **3.1 Advanced Team Collaboration**

#### **A. Task Comments & Discussions**
```javascript
// TaskComment Model
{
  id: ObjectId,
  task_id: ObjectId,
  user_id: ObjectId,
  comment_text: String,
  mentions: Array<ObjectId> (user IDs),
  attachments: Array<String> (file URLs),
  created_at: Date
}
```

**Features:**
- Comment on tasks (team discussion)
- @mention team members (triggers notification)
- File attachments (screenshots, documents)
- Comment thread (reply to comments)

#### **B. Real-Time Collaboration (WebSocket)**
- See who's viewing same objective/task (presence indicators)
- Live updates (task status changes, comments added)
- Collaborative editing (multiple managers editing goals simultaneously)

#### **C. Team Activity Feed**
```javascript
// ActivityFeed Model
{
  id: ObjectId,
  business_id: ObjectId,
  team_id: ObjectId (null = company-wide),
  activity_type: enum('task_completed', 'objective_created', 'goal_assigned', 'comment_added', 'milestone_reached'),
  actor_user_id: ObjectId,
  entity_id: ObjectId (task_id, objective_id, etc.),
  metadata: Object (activity-specific data),
  created_at: Date
}
```

**UI**: Activity feed sidebar (recent team activity, last 24 hours)

**Acceptance Criteria:**
- Team members can comment on tasks
- @mentions trigger notifications
- Real-time updates via WebSocket
- Activity feed shows recent team activity

---

### **3.2 External Integrations**

#### **A. Slack Integration**
- **Notifications**:
  - Task assigned to you
  - Objective at-risk
  - Team member needs support (low sentiment)
  - Daily standup reminder ("Complete your reflection")
- **Bot Commands**:
  - `/karvia my-tasks` (list today's tasks)
  - `/karvia reflect` (quick reflection in Slack)
  - `/karvia team-health` (team sentiment summary)
- **Channel Integration**:
  - Post team activity to #okr-updates channel
  - Weekly summary of completed objectives

**Implementation:**
- Slack OAuth integration
- Slack Events API (receive commands)
- Slack Web API (send notifications)

#### **B. Microsoft Teams Integration**
- Same features as Slack
- Teams Tab: Embed Karvia dashboard in Teams
- Adaptive Cards for rich notifications

#### **C. Google Workspace Integration**
- **Google Calendar**: Add task deadlines as calendar events
- **Google Drive**: Attach Drive files to tasks
- **Google Sheets**: Export OKR progress to Sheets (reporting)

#### **D. Time Tracking Integration**
- **Clockify** / **Toggl** / **Harvest**
- Log time spent on tasks
- Display time logged vs estimated
- Manager view: Team time allocation per objective

**Acceptance Criteria:**
- Slack/Teams notifications work
- Bot commands respond correctly
- Calendar events created for task deadlines
- Time tracking data synced from external tools

---

### **3.3 Mobile Apps (iOS & Android)**

**MVP is web-only. Beta adds native mobile apps.**

**Core Screens:**
1. **Dashboard** (today's tasks, sentiment circles)
2. **My Tasks** (list, mark complete, add notes)
3. **Objectives** (view assigned objectives, progress)
4. **Reflection** (quick daily reflection)
5. **Notifications** (task reminders, team updates)

**Features:**
- Push notifications (task deadlines, @mentions)
- Offline mode (view cached tasks, sync when online)
- Quick actions (swipe to complete task)
- Camera integration (attach photos to tasks)
- Face ID / Touch ID authentication

**Tech Stack:**
- React Native (shared codebase)
- Expo for rapid development
- REST API (reuse existing backend)

**Acceptance Criteria:**
- iOS and Android apps in app stores
- Core flows work on mobile
- Push notifications delivered
- Offline mode caches data
- Biometric authentication supported

---

## 🏢 PHASE 4: ENTERPRISE FEATURES (4 Weeks)

### **4.1 Granular Permissions System**

**MVP has 5 roles with high-level permissions. Beta adds granular control.**

**Permission Structure:**
```javascript
// Role Model (enhanced)
{
  id: ObjectId,
  business_id: ObjectId,
  role_name: String (custom role name),
  is_system_role: Boolean (false = custom role),

  permissions: {
    assessments: {
      view_own: Boolean,
      view_team: Boolean,
      view_all: Boolean,
      create: Boolean,
      edit_own: Boolean,
      edit_all: Boolean,
      delete: Boolean
    },
    objectives: {
      view_assigned: Boolean,
      view_team: Boolean,
      view_all: Boolean,
      create: Boolean,
      edit_assigned: Boolean,
      edit_team: Boolean,
      edit_all: Boolean,
      delete: Boolean,
      generate_okrs: Boolean
    },
    goals: {
      view_assigned: Boolean,
      view_team: Boolean,
      view_all: Boolean,
      assign_to_team: Boolean,
      edit_assigned: Boolean,
      edit_all: Boolean
    },
    tasks: {
      view_assigned: Boolean,
      view_team: Boolean,
      view_all: Boolean,
      create_for_self: Boolean,
      create_for_team: Boolean,
      edit_assigned: Boolean,
      edit_all: Boolean,
      delete: Boolean
    },
    team: {
      invite_users: Boolean,
      edit_users: Boolean,
      remove_users: Boolean,
      view_team_sentiment: Boolean
    },
    analytics: {
      view_personal: Boolean,
      view_team: Boolean,
      view_company: Boolean,
      export_data: Boolean
    },
    admin: {
      create_custom_roles: Boolean,
      edit_permissions: Boolean,
      create_assessment_templates: Boolean,
      configure_integrations: Boolean,
      access_audit_logs: Boolean
    }
  },

  created_at: Date
}
```

**UI**: Permission builder (checkboxes for each permission category)

**Acceptance Criteria:**
- Admin can create custom roles
- Granular permissions enforced on API level
- User assigned custom role sees correct data
- Permission conflicts handled (no security gaps)

---

### **4.2 Sub-Teams and Hierarchies**

**MVP has flat team structure. Beta adds hierarchical teams.**

**Use Cases:**
- Large companies with departments (Sales, Engineering, Marketing)
- Each department has sub-teams (Engineering → Frontend, Backend, DevOps)
- Managers see their department, VPs see all departments

**Data Model:**
```javascript
// Team Model
{
  id: ObjectId,
  business_id: ObjectId,
  name: String,
  parent_team_id: ObjectId (null = root team),
  team_lead_id: ObjectId (ref User),
  members: Array<ObjectId> (user IDs),
  level: Number (0 = company, 1 = department, 2 = sub-team),
  created_at: Date
}

// User Model (add field)
{
  teams: Array<ObjectId> (user can belong to multiple teams),
  primary_team_id: ObjectId
}
```

**UI:**
- Org chart view (visual hierarchy)
- Team switcher (dropdown to view different team's data)
- Cascade objectives (company → department → team → individual)

**Acceptance Criteria:**
- Admin can create sub-teams (hierarchy of 3 levels)
- Objectives cascade from company → department → team
- Manager sees only their team + sub-teams
- Org chart displays correctly

---

### **4.3 Advanced Consultant Tools**

**MVP has simple company switcher. Beta adds consultant-specific features.**

#### **A. Multi-Company Overview Dashboard**
- All client companies in one view
- Health scores per company (Speed/Strength/Intelligence)
- Which clients need attention (low scores, at-risk objectives)
- Revenue per client (if tracking billable hours)

#### **B. Consultant Templates Library**
- Consultant creates OKR templates (reusable across clients)
- Template marketplace (sell to other consultants)
- Apply template to new client (1-click OKR setup)

#### **C. Client Reporting**
- Generate monthly report for client (PDF export)
- Includes: OKR progress, assessment scores, team health, recommendations
- White-label (consultant branding)

#### **D. Consultant Billing (Optional)**
- Track time spent per client
- Generate invoices based on time or subscription
- Stripe integration for client billing

**Acceptance Criteria:**
- Consultant sees multi-company dashboard
- Templates reusable across clients
- Monthly client reports generated
- Billing tracked per client (if enabled)

---

### **4.4 White-Label Advanced Features**

**MVP has basic white-label (logo, colors). Beta adds advanced customization.**

#### **A. Custom Domain**
- Client company uses `okr.acmecorp.com` instead of `app.karvia.com/acmecorp`
- SSL certificate provisioning (automatic via Let's Encrypt)
- DNS setup instructions

#### **B. Custom Email Domain**
- Emails sent from `noreply@acmecorp.com` instead of `noreply@karvia.com`
- Email template customization (add company footer)

#### **C. Custom Branding**
- Upload custom logo
- Choose primary/secondary colors (applied to dashboard)
- Custom welcome message (login screen)
- Custom terminology ("Objectives" → "Goals", "Tasks" → "Actions")

#### **D. White-Label Consultant Platform**
- Consultant rebrand Karvia as their own product
- `consultant.com/okr` (fully branded)
- Charge own pricing (Karvia wholesale pricing)

**Acceptance Criteria:**
- Company can use custom domain (SSL auto-provisioned)
- Emails sent from custom domain
- Dashboard reflects company branding
- Consultants can fully rebrand platform

---

## 🤖 PHASE 5: PLATFORM & AI ENHANCEMENTS (4 Weeks)

### **5.1 Advanced AI Capabilities**

#### **A. AI Coaching Assistant**
```javascript
// AICoachingSession Model
{
  id: ObjectId,
  user_id: ObjectId,
  session_type: enum('task_help', 'objective_brainstorm', 'performance_review', 'career_growth'),
  messages: [
    { role: 'user', content: String, timestamp: Date },
    { role: 'assistant', content: String, timestamp: Date }
  ],
  context: Object (relevant objectives, tasks, assessment scores),
  created_at: Date
}
```

**Features:**
- **Task Help**: "I'm stuck on this task, how should I approach it?"
- **Objective Brainstorming**: "What OKRs should I focus on next quarter?"
- **Performance Review**: "How am I doing compared to my peers?"
- **Career Growth**: "What skills should I develop to advance?"

**UI**: Chat interface (accessible from task tiles, dashboard, anywhere)

**Implementation:**
- OpenAI GPT-4 with Karvia context
- Include user's: assessment scores, current objectives, tasks, team role
- Conversation history (last 10 messages)
- Safety: Filter inappropriate content, rate limiting

#### **B. AI-Powered Task Breakdown**
- Manager creates goal: "Improve customer satisfaction by 20%"
- AI suggests: 7-10 specific tasks with time estimates
- Manager edits/approves tasks
- AI learns from manager edits (improve suggestions)

#### **C. Automated OKR Quality Scoring**
- Evaluate each objective against SMART criteria
- Score: 0-100 (how good is this OKR?)
- Suggestions to improve (make more measurable, add deadline, etc.)

**Example:**
```
Objective: "Grow the business"
Score: 35/100 ❌
Issues:
- Not measurable (what metric?)
- Not time-bound (by when?)
- Too vague ("grow" how?)

Suggested Improvement: "Increase monthly recurring revenue by 30% by end of Q4"
Score: 85/100 ✅
```

#### **D. Smart OKR Recommendations**
- Based on assessment results, suggest which objectives to prioritize
- "Your Speed score is low (45/100). Focus on operational efficiency OKRs first."
- "Your Intelligence score is high (88/100). Consider innovation-focused OKRs."

**Acceptance Criteria:**
- AI coaching chat responds helpfully
- Task breakdown suggestions relevant and specific
- OKR quality scoring accurate (matches best practices)
- Recommendations improve over time (learning)

---

### **5.2 Automation & Workflows**

#### **A. Automated Task Creation**
- **Trigger**: Weekly goal created
- **Action**: AI generates 5-7 tasks, assigns to team, sets due dates
- **Approval**: Manager reviews and approves (one-click)

#### **B. Automated Status Updates**
- **Trigger**: All tasks for a goal completed
- **Action**: Mark goal as "Completed", update objective progress
- **Notification**: Notify manager, celebrate with team

#### **C. Automated Reminders**
- Task due in 2 days → Email reminder to assignee
- Reflection not submitted today → Push notification at 5pm
- Objective falling behind → Alert manager

#### **D. Workflow Builder (Advanced)**
```javascript
// Workflow Model
{
  id: ObjectId,
  business_id: ObjectId,
  name: String,
  trigger: {
    type: enum('task_completed', 'goal_completed', 'objective_created', 'assessment_completed', 'date', 'sentiment_low'),
    conditions: Object (e.g., "when task status = completed AND task.objective_id = X")
  },
  actions: [
    {
      type: enum('create_task', 'send_notification', 'update_status', 'run_ai', 'send_webhook'),
      parameters: Object
    }
  ],
  is_active: Boolean,
  created_at: Date
}
```

**UI**: Visual workflow builder (drag-and-drop)
- Select trigger (dropdown)
- Add conditions (if/then logic)
- Define actions (what happens)
- Save and activate

**Examples:**
1. **When objective at-risk** → Send Slack notification to team lead
2. **When team sentiment < 50** → Schedule 1-on-1 meeting (add to calendar)
3. **When assessment completed** → Generate OKRs → Email to owner

**Acceptance Criteria:**
- Automated task creation works (AI generates tasks)
- Status updates automated (task → goal → objective)
- Reminders sent at correct times
- Workflow builder allows custom workflows

---

### **5.3 Performance Optimization**

**As data grows, system must scale.**

#### **A. Database Optimization**
- Index frequently queried fields (user_id, business_id, date)
- Aggregation pipeline for analytics (pre-compute metrics)
- Archive old data (move completed objectives >2 years old to cold storage)

#### **B. Caching Strategy**
- Redis for:
  - OpenAI responses (24 hours)
  - Dashboard data (5 minutes)
  - Assessment results (until reassessment)
- Cache invalidation on data changes

#### **C. API Rate Limiting**
- Prevent abuse (1000 requests/hour per user)
- OpenAI rate limiting (10 OKR generations/hour per business)

#### **D. Frontend Performance**
- Lazy loading (load dashboard components on demand)
- Virtualized lists (only render visible tasks)
- Code splitting (reduce initial bundle size)

**Acceptance Criteria:**
- Dashboard loads in <2 seconds (with 1000 objectives)
- API response time <200ms (90th percentile)
- No performance degradation with 10,000 users
- Frontend bundle size <500KB (gzipped)

---

### **5.4 Advanced Reporting & Exports**

#### **A. Custom Report Builder**
- Select metrics (OKR completion, task velocity, sentiment trends)
- Choose date range (last 30 days, Q4, YTD, custom)
- Group by (team, individual, objective, time period)
- Visualizations (charts, tables, heatmaps)
- Export (PDF, Excel, Google Sheets)

#### **B. Executive Dashboards**
- C-level overview (company health, top objectives, risks)
- Department comparisons (which teams performing well?)
- Historical trends (Speed/Strength/Intelligence over 12 months)
- Forecast (predicted objective completion)

#### **C. Data Export**
- Export all data (objectives, tasks, assessments, reflections) as JSON/CSV
- GDPR compliance (user data export on request)
- API for external BI tools (Tableau, Power BI)

**Acceptance Criteria:**
- Custom report builder generates reports correctly
- Executive dashboard shows company-level metrics
- Data export includes all relevant data
- API for BI tools documented and tested

---

## 📊 BETA RELEASE FEATURE SUMMARY

### **Assessment System**
- ✅ 6 pre-built assessment templates (MVP + 5 new)
- ✅ Custom template builder
- ✅ Custom formula editor
- ✅ Template marketplace (buy/sell templates)

### **Analytics & Insights**
- ✅ Sentiment analysis & reflection system
- ✅ Dual sentiment circles (individual + team)
- ✅ Health indicators (individual/team/company)
- ✅ Predictive analytics (at-risk objectives, burnout prediction)
- ✅ Horizontal AI insights layout

### **Collaboration**
- ✅ Task comments & discussions
- ✅ Real-time collaboration (WebSocket)
- ✅ Activity feed
- ✅ Slack/Teams integration
- ✅ Google Workspace integration
- ✅ Time tracking integration

### **Mobile**
- ✅ iOS app
- ✅ Android app
- ✅ Push notifications
- ✅ Offline mode

### **Enterprise**
- ✅ Granular permissions system
- ✅ Custom roles
- ✅ Sub-teams and hierarchies
- ✅ Org chart view
- ✅ Advanced consultant tools
- ✅ White-label advanced features (custom domain, email)

### **AI & Automation**
- ✅ AI coaching assistant (chat)
- ✅ AI-powered task breakdown
- ✅ OKR quality scoring
- ✅ Smart OKR recommendations
- ✅ Automated workflows
- ✅ Workflow builder

### **Platform**
- ✅ Performance optimization (caching, indexing)
- ✅ Advanced reporting & exports
- ✅ Executive dashboards
- ✅ Custom report builder
- ✅ BI tool integrations

---

## 🗓️ BETA RELEASE TIMELINE

**Total Duration**: 20 weeks (5 months)

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1**: Enhanced Assessment | 4 weeks | 5 new templates, custom builder, marketplace |
| **Phase 2**: Analytics & Insights | 4 weeks | Sentiment system, health indicators, predictive analytics |
| **Phase 3**: Collaboration & Integrations | 4 weeks | Task comments, Slack/Teams, mobile apps |
| **Phase 4**: Enterprise Features | 4 weeks | Granular permissions, sub-teams, consultant tools |
| **Phase 5**: Platform & AI | 4 weeks | AI coaching, workflows, performance optimization |

**Beta Release Target**: Q1 2026 (March-April)

---

## ✅ BETA SUCCESS METRICS

### **User Adoption**
- 50+ companies using platform
- 2,000+ active users (managers, employees)
- 10+ consultants with multi-company access
- 80% monthly active user rate

### **Feature Adoption**
- 60% of companies use custom assessment templates
- 70% of users submit daily reflections
- 40% of teams use Slack/Teams integration
- 30% of companies use mobile apps
- 20% of consultants sell templates in marketplace

### **User Satisfaction**
- Net Promoter Score (NPS): 50+
- Feature satisfaction: 4.5/5 average
- Support ticket volume: <10% of users per month
- Churn rate: <5% per quarter

### **Technical Performance**
- Dashboard load time: <2 seconds (p90)
- API response time: <200ms (p90)
- Uptime: 99.9%
- OpenAI integration success rate: >95%

### **Business Metrics**
- $50K+ MRR (Monthly Recurring Revenue)
- $500+ ARPU (Average Revenue Per User/Company)
- 5+ enterprise contracts ($10K+/year)
- 50+ marketplace template transactions

---

## 🔗 RELATIONSHIP TO MVP

**This document (BETA_RELEASE_STRATEGY.md) contains all features deferred from MVP (Nov 30, 2025).**

**For MVP scope, see:**
- `/Karvia_OKR_Product_Planning/MVP_STRATEGY_REVISED.md`

**Key Differences:**

| Feature | MVP (Nov 30) | Beta (Q1 2026) |
|---------|--------------|----------------|
| Assessment Templates | 1 (Speed/Strength/Intelligence) | 6 templates + custom builder |
| Formula Editor | Weighted average only | Custom formula editor |
| Permissions | 5 roles (high-level) | Granular permissions + custom roles |
| Collaboration | Basic (view/assign) | Comments, real-time, activity feed |
| Integrations | None | Slack, Teams, Google Workspace |
| Mobile | Web-only | iOS + Android apps |
| AI | OKR generation + task suggestions | AI coaching, quality scoring, predictions |
| Automation | Manual workflows | Automated workflows + workflow builder |
| Analytics | Basic progress tracking | Sentiment, health, predictive analytics |
| Reporting | Simple exports | Custom report builder, executive dashboards |
| Consultant Tools | Simple company switcher | Multi-company dashboard, templates, billing |
| White-Label | Logo + colors | Custom domain, email, full rebrand |

---

## 🚀 IMPLEMENTATION PRIORITIES

### **Must-Have for Beta**
1. Sentiment & Reflection System (Lines 17-42 from post_implementation_checklist)
2. 5 Additional Assessment Templates
3. Mobile Apps (iOS + Android)
4. Slack/Teams Integration
5. Granular Permissions
6. AI Coaching Assistant

### **Nice-to-Have for Beta**
1. Template Marketplace
2. Custom Formula Editor
3. Workflow Builder (advanced)
4. Time Tracking Integration
5. BI Tool Integrations

### **Defer to Post-Beta (v2.0)**
1. Consultant Billing System
2. White-Label Consultant Platform (full rebrand)
3. Multi-language Support
4. Advanced ML Models (custom trained)

---

## 📝 NOTES

**This strategy aligns with:**
- `/Karvia_OKR_Product_Planning/MVP_STRATEGY_REVISED.md` (MVP baseline)
- `/post_implementation_checklist_karviaokr.md` (sentiment/reflection system)

**All features in this document are POST-MVP (after Nov 30, 2025).**

**MVP delivers core value flow. Beta delivers enterprise-grade completeness.**

---

**Document Owner**: Product Team
**Last Updated**: October 1, 2025
**Status**: DRAFT - Beta Roadmap Planning
**Next Review**: After MVP Launch (Dec 2025)
