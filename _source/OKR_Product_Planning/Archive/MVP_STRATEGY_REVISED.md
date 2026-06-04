# 🚀 KARVIA OKR - MVP STRATEGY (REVISED)

**Version**: 2.0 (Revised Based on Existing Infrastructure)
**Date**: October 1, 2025
**Target Launch**: November 30, 2025 (8 weeks)
**Approach**: Leverage 90% existing code, complete 10% gaps

---

## 📊 STRATEGIC PIVOT

### **Key Insight from Codebase Audit:**

**WE ALREADY HAVE 90% OF THE MVP BUILT!**

✅ 6 microservice engines operational (IAM, Assessment, Planner, Scoring, Observer, Tracking)
✅ Complete Objective model with Key Results, progress tracking, AI insights
✅ Business model with Speed/Strength/Intelligence assessment scores
✅ Frontend design system migrated (90%+ components from goaltracker)
✅ API routes for objectives, assessments (goals/tasks are placeholders)

**What We Need to Build (10%):**
1. Complete Objective → Goals → Tasks cascade
2. OpenAI integration for OKR generation
3. Expand Business model (16 archetypes, strategic preferences)
4. Role-based dashboards (reusing existing UI)
5. Invitation system for team onboarding

---

## 🎯 MVP SCOPE (Nov 30, 2025)

### **Core Value Flow:**
```
Owner → Take Assessment → Get Speed/Strength/Intelligence Scores
  ↓
Generate OKRs (OpenAI-powered)
  ↓
Manager → Select OKRs → Break into Weekly Goals → Assign Tasks
  ↓
Employee → Complete Tasks → Achieve Objectives
```

---

## ✅ WHAT WE'RE SHIPPING (MVP)

### **1. ASSESSMENT SYSTEM (Single Template, Scalable)**

**Ship:**
- ✅ Speed/Strength/Intelligence assessment (already built in Assessment Engine)
- ✅ Template system infrastructure (for future additions)
- ✅ Assessment results dashboard with scores (0-100 per category)
- ✅ Calculation: Weighted average formula only (no custom formulas)

**Architecture:**
```javascript
// Assessment template structure (single template for MVP)
{
  id: "speed_strength_intelligence",
  name: "Speed/Strength/Intelligence Framework",
  version: "1.0",
  categories: [
    { id: "speed", name: "Speed (Business Agility)", weight: 33.3, questions: [...] },
    { id: "strength", name: "Strength (Stability)", weight: 33.3, questions: [...] },
    { id: "intelligence", name: "Intelligence (Insight)", weight: 33.4, questions: [...] }
  ],
  calculationMethod: "weighted_average" // Only this for MVP
}

// Future templates can be added via:
POST /api/assessment/templates
```

**Defer to Beta:**
- ❌ Custom template builder UI
- ❌ Additional pre-built templates (Balanced Scorecard, McKinsey 7S, etc.)
- ❌ Custom formula editor
- ❌ Template marketplace

---

### **2. BUSINESS ARCHETYPES & STRATEGIC PREFERENCES**

**Ship:**
- ✅ 16 Business Archetypes (enum in Business model):

```javascript
// Expand Business.industry from 6 to 16 archetypes
archetypes: [
  // B2B
  'b2b_professional_services',
  'b2b_saas',
  'b2b_manufacturing',
  'b2b_distribution',
  'b2b_tech_services',
  'b2b_financial_services',
  'b2b_healthcare_services',
  'b2b_education',
  // B2C
  'b2c_retail_ecommerce',
  'b2c_saas',
  'b2c_hospitality',
  'b2c_healthcare_wellness',
  'b2c_education',
  'b2c_entertainment_media',
  'b2c_professional_services',
  'b2c_manufacturing'
]
```

- ✅ Strategic Preferences (new field in Business model):

```javascript
strategic_preferences: {
  growth_revenue: ['client_acquisition', 'revenue_growth', 'market_expansion', 'pricing_optimization'],
  operations_delivery: ['delivery_excellence', 'operational_efficiency', 'quality_improvement', 'process_automation'],
  team_culture: ['team_development', 'hiring_onboarding', 'culture_engagement', 'leadership_development'],
  product_innovation: ['product_development', 'innovation_rd', 'technology_stack', 'customer_experience'],
  marketing_brand: ['brand_awareness', 'content_marketing', 'social_media', 'thought_leadership'],
  financial_systems: ['financial_health', 'cash_flow', 'systems_tools', 'data_analytics']
},
preference_priority: {
  primary: ['client_acquisition', 'delivery_excellence'], // Owner selects
  secondary: ['team_development', 'innovation_rd']
}
```

**Why This Works:**
- Simple enum expansion (1 day work)
- Directly used in OpenAI prompt for OKR generation
- No complex UI needed for MVP (dropdown + checkboxes)

---

### **3. COMPLETE OKR CASCADE: Objective → Goals → Tasks**

**Ship:**
- ✅ Goals API & Model (complete `/api/goals` placeholder)
- ✅ Tasks API & Model (complete `/api/tasks` placeholder)
- ✅ Cascade logic: Objectives contain Key Results, Goals belong to Key Results, Tasks belong to Goals

**Data Model:**
```javascript
// Goal Model (NEW - Weekly breakdown of Key Results)
{
  id: ObjectId,
  objective_id: ObjectId (ref Objective),
  key_result_id: String (KR within Objective),
  title: String,
  description: String,
  week_number: Number (1-52),
  quarter: Number (1-4),
  status: enum('not_started', 'in_progress', 'completed', 'at_risk'),
  assigned_to: ObjectId (ref User),
  due_date: Date,
  progress_percentage: Number (0-100),
  created_at: Date
}

// Task Model (NEW - Daily/weekly actions)
{
  id: ObjectId,
  goal_id: ObjectId (ref Goal),
  title: String,
  description: String,
  assigned_to: ObjectId (ref User),
  created_by: ObjectId (ref User - manager),
  due_date: Date,
  estimated_hours: Number,
  status: enum('todo', 'in_progress', 'completed', 'blocked'),
  priority: enum('low', 'medium', 'high', 'urgent'),
  ai_generated: Boolean, // If suggested by OpenAI
  completion_notes: String,
  completed_at: Date,
  created_at: Date
}
```

**API Endpoints:**
```javascript
// Goals
GET    /api/goals                    // List goals (filter by objective, user, quarter)
POST   /api/goals                    // Create goal
GET    /api/goals/:id                // Get goal details
PUT    /api/goals/:id                // Update goal
DELETE /api/goals/:id                // Delete goal
PUT    /api/goals/:id/progress       // Update progress

// Tasks
GET    /api/tasks                    // List tasks (filter by goal, user, status)
POST   /api/tasks                    // Create task
POST   /api/tasks/ai-suggest         // AI suggests tasks for a goal (NEW)
GET    /api/tasks/:id                // Get task details
PUT    /api/tasks/:id                // Update task
DELETE /api/tasks/:id                // Delete task
PUT    /api/tasks/:id/complete       // Mark complete
GET    /api/tasks/my-tasks           // My tasks today
```

**Defer to Beta:**
- ❌ Advanced task dependencies
- ❌ Task templates library
- ❌ Gantt chart view
- ❌ Time tracking integration

---

### **4. OPENAI-POWERED OKR GENERATION** ⭐ **DIFFERENTIATOR**

**Ship:**
- ✅ OpenAI GPT-4 integration in Planner Engine (Port 8083)
- ✅ Generate 4-6 objectives from: Assessment results + Business archetype + Strategic preferences
- ✅ AI Task Suggestions: When manager breaks KR → Goals, AI suggests tasks
- ✅ Caching layer (Redis) to reduce API costs
- ✅ Fallback: Template-based OKRs if OpenAI fails

**Integration Architecture:**
```javascript
// Planner Engine (8083) - NEW OpenAI Integration
class PlannerEngine {
  async generateObjectives(businessId, assessmentId) {
    // 1. Fetch data
    const business = await Business.findById(businessId);
    const assessment = await Assessment.findById(assessmentId);

    // 2. Check cache
    const cacheKey = `okr_${businessId}_${assessmentId}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 3. Build OpenAI prompt
    const prompt = this.buildOKRPrompt({
      archetype: business.archetype,
      preferences: business.strategic_preferences,
      assessmentScores: assessment.scores,
      weakestAreas: assessment.weakest_areas
    });

    // 4. Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2500
    });

    // 5. Parse and validate
    const objectives = JSON.parse(response.choices[0].message.content);

    // 6. Cache for 24 hours
    await redis.setex(cacheKey, 86400, JSON.stringify(objectives));

    return objectives;
  }

  async suggestTasks(goalId) {
    // AI suggests 5-7 tasks to complete a goal
    const goal = await Goal.findById(goalId).populate('objective_id');

    const prompt = `Given this goal: "${goal.title}"
    Which contributes to Key Result: "${goal.key_result.description}"
    Of Objective: "${goal.objective_id.title}"

    Suggest 5-7 specific, actionable tasks with time estimates.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    return this.parseTasks(response.choices[0].message.content);
  }
}
```

**Prompt Template (OKR Generation):**
```
You are a business strategy consultant specializing in OKR design.

BUSINESS CONTEXT:
- Archetype: ${business.archetype}
- Size: ${business.employee_count} employees

ASSESSMENT RESULTS:
- Speed: ${assessment.speed_score}/100 ${assessment.speed_score < 70 ? '[NEEDS ATTENTION]' : '[STRONG]'}
- Strength: ${assessment.strength_score}/100
- Intelligence: ${assessment.intelligence_score}/100
Overall: ${assessment.overall_score}/100

WEAKEST AREAS:
${assessment.weakest_areas.map(a => `- ${a.name}: ${a.score}/100`).join('\n')}

STRATEGIC PRIORITIES:
Primary: ${business.preference_priority.primary.join(', ')}
Secondary: ${business.preference_priority.secondary.join(', ')}

Generate 4-6 quarterly objectives that:
1. Address assessment weaknesses (prioritize scores <70)
2. Align with primary strategic priorities (80% weight)
3. Are appropriate for ${business.archetype}
4. Follow OKR best practices (measurable, time-bound)

For each objective:
{
  "title": "Inspiring objective",
  "rationale": "Why this matters (reference assessment scores)",
  "focusArea": "Which strategic priority",
  "difficulty": "Easy|Medium|Hard",
  "estimatedEffort": "15-25% of capacity",
  "keyResults": [
    {
      "description": "Specific outcome",
      "metric": "What to measure",
      "baseline": "Current state",
      "target": "Ambitious target",
      "quarter": 4
    }
  ]
}

Return JSON array only.
```

**Defer to Beta:**
- ❌ Multi-model support (Claude, Gemini)
- ❌ Fine-tuned models for specific industries
- ❌ Advanced prompt engineering (few-shot examples)
- ❌ OKR quality scoring

---

### **5. ROLE-BASED SYSTEM (5 Roles, Core Flows)**

**Ship:**
- ✅ 5 Roles (in IAM Engine):
  1. **Super Admin** (Karvia platform level - for us)
  2. **Company Admin** (Business owner)
  3. **Manager**
  4. **Employee**
  5. **Consultant** (multi-company access)

**Permissions Matrix (High-Level for MVP):**

| Feature | Company Admin | Manager | Employee | Consultant |
|---------|---------------|---------|----------|------------|
| Take assessment | ✅ | ✅ | ✅ | ✅ (per company) |
| Generate OKRs | ✅ | ❌ | ❌ | ✅ (for client) |
| View all objectives | ✅ | ✅ (own team) | ✅ (assigned) | ✅ (per company) |
| Create objectives | ✅ | ❌ | ❌ | ✅ |
| Assign goals to team | ✅ | ✅ | ❌ | ❌ |
| Create tasks | ✅ | ✅ | ❌ | ❌ |
| Complete tasks | ✅ | ✅ | ✅ | ❌ |
| Invite users | ✅ | ✅ (to team) | ❌ | ✅ |
| View analytics | ✅ | ✅ (team) | ✅ (personal) | ✅ (company) |
| Switch companies | ❌ | ❌ | ❌ | ✅ |

**Consultant Multi-Company (Simple):**
```javascript
// User model extension
{
  role: 'consultant',
  companies: [ObjectId, ObjectId, ...], // Multiple company IDs
  active_company_id: ObjectId, // Currently viewing

  // Methods
  switchCompany(companyId) {
    this.active_company_id = companyId;
  }
}

// Frontend: Company switcher dropdown in nav
<select onChange={switchCompany}>
  <option value="company1">Acme Corp</option>
  <option value="company2">Beta Inc</option>
</select>
```

**Defer to Beta:**
- ❌ Granular permissions (custom roles)
- ❌ Sub-teams and hierarchies
- ❌ Advanced consultant dashboard (multi-company overview)
- ❌ Consultant billing per company

---

### **6. CORE USER FLOWS & SCREENS (15 Screens)**

**Focus: All 5 roles, core flows only**

#### **Owner/Company Admin Flow (5 screens):**
1. **Signup & Business Profile** (`owner_signup.html`)
   - Company name, archetype (dropdown of 16), employee count
   - Strategic preferences (checkboxes, mark primary/secondary)
2. **Take Assessment** (`owner_assessment.html`)
   - Speed/Strength/Intelligence questions (progressive UI)
   - Progress bar, save & continue
3. **Assessment Results** (`owner_results.html`)
   - 3 circular gauges (Speed, Strength, Intelligence)
   - Overall score, AI insights
   - **"Generate OKRs" CTA button** (primary action)
4. **Review Generated OKRs** (`owner_review_okrs.html`)
   - 4-6 objective cards (AI-generated)
   - Edit titles, KRs, rationale
   - Approve/reject/regenerate
5. **Invite Team** (`owner_invite.html`)
   - Add emails, assign roles (Manager/Employee)
   - Send invitation links

#### **Manager Flow (4 screens):**
6. **Manager Dashboard** (`manager_dashboard.html`)
   - Team progress overview
   - Action queue (approvals needed)
   - My tasks today (top 3)
7. **Manager Planning** (`manager_planning.html`)
   - Left: Available objectives (from owner)
   - Center: My team's OKRs (selected)
   - Right: Team members, assign goals
   - **AI Suggest Tasks button** (per goal)
8. **Team Management** (`manager_team.html`)
   - Team member cards (status, capacity, tasks)
   - Add team member button
9. **Task Assignment** (`manager_tasks.html`)
   - Goal breakdown into tasks
   - Assign to team, set due dates

#### **Employee Flow (3 screens):**
10. **Employee Dashboard** (`employee_dashboard.html`)
    - **My 3 Tasks Today** (large cards)
    - Why each task matters (linked to KR → Objective)
    - Mark complete, request help
11. **My Objectives** (`employee_objectives.html`)
    - All assigned objectives
    - Progress bars, KR details
    - My contribution to each
12. **Task Detail** (`employee_task_detail.html`)
    - Task description, context, attachments
    - Complete/defer/comment actions

#### **Consultant Flow (2 screens):**
13. **Consultant Client List** (`consultant_clients.html`)
    - All client companies
    - Health scores (Speed/Strength/Intelligence per company)
    - Switch company button
14. **Consultant Company View** (`consultant_company_view.html`)
    - Same as Owner Dashboard (for selected company)
    - Generate OKRs for client

#### **Shared (1 screen):**
15. **Registration via Invite** (`invite_register.html`)
    - Token-based registration
    - Email pre-filled, password setup
    - Auto-assigned to company + role

**Defer to Beta:**
- ❌ Analytics dashboards (charts, trends)
- ❌ Admin system configuration screen
- ❌ Advanced team collaboration features
- ❌ Settings/profile pages (keep minimal for MVP)

---

## 🏗️ IMPLEMENTATION PLAN (8 WEEKS)

### **Week 1-2: Complete OKR Cascade**

**Goals API & Model:**
- [ ] Create Goal schema in `/server/models/Goal.js`
- [ ] Implement `/api/goals` CRUD endpoints
- [ ] Link goals to Key Results (within Objectives)
- [ ] Test goal creation and progress tracking

**Tasks API & Model:**
- [ ] Create Task schema in `/server/models/Task.js`
- [ ] Implement `/api/tasks` CRUD endpoints
- [ ] AI task suggestion endpoint (`POST /api/tasks/ai-suggest`)
- [ ] Test task assignment and completion

**Frontend:**
- [ ] Objective → Goals → Tasks cascade UI (reuse existing components)
- [ ] Manager planning screen (goals assignment)
- [ ] Employee task cards (today's tasks)

**Output**: Complete Objective → Goals → Tasks working end-to-end

---

### **Week 3-4: OpenAI Integration & Archetype System**

**Backend:**
- [ ] Expand Business model: Add archetype enum (16 options)
- [ ] Add strategic_preferences field to Business model
- [ ] OpenAI client setup in Planner Engine
- [ ] Implement OKR generation with OpenAI
- [ ] Implement AI task suggestions
- [ ] Redis caching layer
- [ ] Fallback template-based OKRs

**Frontend:**
- [ ] Owner signup: Archetype selector, preferences checkboxes
- [ ] Assessment results: "Generate OKRs" button
- [ ] Review OKRs: Edit, approve, regenerate flow
- [ ] Manager: "AI Suggest Tasks" button

**Testing:**
- [ ] Test OpenAI with different archetypes
- [ ] Validate OKR quality
- [ ] Test caching and fallback

**Output**: AI-powered OKR generation working

---

### **Week 5-6: Role System & Dashboards**

**Backend:**
- [ ] Implement 5-role permissions in IAM Engine
- [ ] Invitation system (email + token)
- [ ] Consultant multi-company logic
- [ ] Role-based data filtering APIs

**Frontend:**
- [ ] Owner: 5 screens (signup, assessment, results, review, invite)
- [ ] Manager: 4 screens (dashboard, planning, team, tasks)
- [ ] Employee: 3 screens (dashboard, objectives, task detail)
- [ ] Consultant: 2 screens (clients, company view)
- [ ] Shared: Registration via invite

**Testing:**
- [ ] Test all 5 role flows
- [ ] Test permissions (users can't access unauthorized data)
- [ ] Test consultant company switching

**Output**: All 5 roles with core dashboards

---

### **Week 7: Integration Testing & Bug Fixes**

- [ ] End-to-end testing:
  - [ ] Owner: Signup → Assessment → Generate OKRs → Invite team
  - [ ] Manager: Register → Select OKRs → Assign goals → Create tasks
  - [ ] Employee: Register → View tasks → Complete tasks
  - [ ] Consultant: Add company → Generate OKRs for client
- [ ] Bug fixes and edge cases
- [ ] Performance optimization (slow queries, large data)
- [ ] Security audit (auth, data access)

**Output**: Stable, tested MVP

---

### **Week 8: Launch Preparation**

- [ ] Documentation:
  - [ ] User guides (one per role)
  - [ ] API documentation
  - [ ] Deployment guide
- [ ] Beta user onboarding:
  - [ ] 5 beta companies
  - [ ] 2 consultants with multi-company
- [ ] Production deployment:
  - [ ] Environment setup
  - [ ] Domain + SSL
  - [ ] Monitoring (Sentry, Analytics)
- [ ] Launch (Nov 30, 2025)

**Output**: Live MVP with beta users

---

## 📊 SUCCESS METRICS (MVP)

### **Technical:**
- ✅ All 15 core screens functional
- ✅ OpenAI generates 4-6 quality objectives (<5 sec response)
- ✅ Goals and Tasks API 100% operational
- ✅ 5 roles with correct permissions
- ✅ Consultant can switch companies
- ✅ 99% uptime during testing

### **User Experience:**
- ✅ Owner onboarding: <30 minutes (signup → generate OKRs)
- ✅ Assessment completion rate: >80%
- ✅ Manager planning time: <20 minutes (assign goals + tasks)
- ✅ Employee clarity: 4.5/5 rating (understand tasks → objectives)

### **Business:**
- ✅ 5 beta companies onboarded
- ✅ 50+ users (owners, managers, employees)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated (AI-powered)
- ✅ 2+ consultants with multi-company access
- ✅ Zero data loss incidents

---

## ✅ MVP FEATURE LIST (Final)

| Feature | Status | Notes |
|---------|--------|-------|
| **Assessment System** | ✅ Ship 1 template | Speed/Strength/Intelligence only |
| **Weighted Average Formula** | ✅ Ship | No custom formulas |
| **16 Business Archetypes** | ✅ Ship | Enum in Business model |
| **Strategic Preferences (24 focus areas)** | ✅ Ship | Primary/secondary weighting |
| **Goals API & Model** | ✅ Ship | Weekly breakdown of KRs |
| **Tasks API & Model** | ✅ Ship | Daily/weekly actions |
| **OpenAI OKR Generation** | ✅ Ship | GPT-4 integration |
| **AI Task Suggestions** | ✅ Ship | Manager requests, AI suggests |
| **5-Role System** | ✅ Ship | High-level permissions |
| **Consultant Multi-Company** | ✅ Ship | Simple switcher |
| **15 Core Screens** | ✅ Ship | All 5 roles covered |
| **Invitation System** | ✅ Ship | Email + token registration |
| **Caching Layer** | ✅ Ship | Redis for OpenAI responses |
| **Fallback OKRs** | ✅ Ship | Template-based if AI fails |

---

## 🚀 POST-MVP (Beta Release)

**All advanced features deferred to BETA_RELEASE_STRATEGY.md:**
- Template marketplace
- Custom formula editor
- 5 additional assessment templates
- Advanced analytics dashboards
- Granular permissions
- Sub-teams and hierarchies
- Gantt charts
- Time tracking
- Integrations (Slack, Teams, etc.)
- Mobile apps

---

## 🎯 KEY STRATEGIC DECISIONS (LOCKED)

1. ✅ **Single Assessment Template**: Ship Speed/Strength/Intelligence only, add more post-MVP
2. ✅ **Weighted Average Only**: No custom formulas for MVP (safer, faster)
3. ✅ **15 Core Screens**: Focus on essential user flows for all 5 roles
4. ✅ **AI Task Suggestions**: Include (high value, reuses OpenAI integration)
5. ✅ **Simple Multi-Company**: Consultant switches one at a time (defer advanced dashboard)
6. ✅ **Leverage Existing 90%**: Build on Objective model, engines, frontend components
7. ✅ **Complete Goals + Tasks**: Critical gap to close for full OKR cascade
8. ✅ **OpenAI as Differentiator**: This is what makes Karvia unique

---

**Document Owner**: Product Team
**Last Updated**: October 1, 2025 (Revised after codebase audit)
**Next Review**: Weekly sprint reviews
**Status**: LOCKED FOR MVP - Nov 30, 2025 Launch
