# 🚀 KARVIA BUSINESS - MVP STRATEGY DOCUMENT

**Version**: 1.0
**Date**: October 1, 2025
**Target Launch**: November 30, 2025
**Timeline**: 8 weeks

---

## 📊 EXECUTIVE SUMMARY

Karvia Business is a **configurable assessment-driven OKR platform** designed for consultants, business owners, and growing companies (20-200 employees). Unlike fixed-question OKR tools, Karvia enables **assessment framework customization** and uses **AI-powered OKR generation** based on business health diagnostics.

### **Core Value Proposition:**
1. **Flexible Assessment Framework**: 6 pre-built templates + custom template builder
2. **AI-Powered OKR Generation**: OpenAI-driven objectives based on assessment gaps
3. **Multi-Company Consultant Access**: One consultant manages multiple client companies
4. **Role-Based Workflows**: Admin, Manager, Employee, Consultant with distinct experiences

### **Key Differentiators:**
- **Not just another OKR tool** - Assessment-driven strategy platform
- **Consultant-friendly** - Multi-company access, template customization, white-label ready
- **AI-Native** - OpenAI integration for intelligent OKR suggestions
- **Business Archetype Intelligence** - 16 archetypes with tailored recommendations

---

## 🎯 MVP SCOPE DEFINITION

### **In-Scope for Nov 30 MVP:**

#### **1. Assessment Framework System**
- ✅ 6 Pre-built Assessment Templates:
  1. Speed/Strength/Intelligence (Default)
  2. McKinsey 7S Framework
  3. Balanced Scorecard
  4. Startup Health Check
  5. Service Business Maturity
  6. E-commerce Readiness
- ✅ Custom Template Builder with formula editor
- ✅ Weighted average + custom formula calculation
- ✅ Category-based scoring (0-100)
- ✅ Assessment assignment by role/function

#### **2. Business Archetype System**
- ✅ 16 Business Archetypes:

  **B2B (Business-to-Business):**
  1. B2B Professional Services (consulting, agencies)
  2. B2B SaaS (software as a service)
  3. B2B Manufacturing
  4. B2B Distribution/Wholesale
  5. B2B Technology Services
  6. B2B Financial Services
  7. B2B Healthcare Services
  8. B2B Education/Training

  **B2C (Business-to-Consumer):**
  9. B2C Retail/E-commerce
  10. B2C SaaS/Digital Products
  11. B2C Hospitality/Food Service
  12. B2C Healthcare/Wellness
  13. B2C Education/Training
  14. B2C Entertainment/Media
  15. B2C Professional Services
  16. B2C Manufacturing/Products

- ✅ Growth stage selection (Startup/Established/Mature)
- ✅ Company size categories (1, 2-10, 11-50, 51-200, 200+)
- ✅ Revenue model multi-select

#### **3. Strategic Preferences System**
- ✅ 24 Focus Areas across 6 categories
- ✅ Unlimited selection (no forced limit)
- ✅ Priority weighting: Primary vs Secondary
- ✅ Used as input for LLM OKR generation

#### **4. OpenAI-Powered OKR Generation**
- ✅ GPT-4 integration
- ✅ Input: Assessment results + Business archetype + Strategic preferences
- ✅ Output: 4-6 objectives with 3-4 KRs each
- ✅ Rationale for each objective
- ✅ Difficulty level and effort estimation
- ✅ Owner review/edit/approve workflow

#### **5. Role-Based Access Control**
- ✅ 5 Roles:
  1. Super Admin (Karvia platform level)
  2. Company Admin (Business owner)
  3. Manager
  4. Employee
  5. Consultant (multi-company access)
- ✅ Granular permissions per role
- ✅ High-level MVP implementation

#### **6. Consultant Multi-Company Access**
- ✅ Single consultant account → multiple client companies
- ✅ Company switcher in navigation
- ✅ Create templates shared across clients
- ✅ View progress reports for all clients
- ✅ Billing per company or consolidated

#### **7. Core User Workflows**
- ✅ Owner: Sign up → Create business profile → Take assessment → Generate OKRs → Invite team
- ✅ Manager: Register → Take assessment → Select OKRs → Add team members → Assign tasks
- ✅ Employee: Register → Take assessment → View objectives → Complete tasks
- ✅ Consultant: Sign up → Add client companies → Customize templates → View client progress

---

### **Out-of-Scope (Post-MVP):**
- ❌ Template marketplace (consultants selling templates)
- ❌ Advanced analytics dashboard
- ❌ Mobile native apps (responsive web only)
- ❌ Integrations (Slack, Teams, Google Workspace)
- ❌ Advanced reporting/exports
- ❌ Multi-language support
- ❌ Gamification/rewards system
- ❌ Real-time collaboration features
- ❌ API for third-party integrations

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Technology Stack:**

**Frontend:**
- React.js (migrated from goaltracker - 90% component reuse)
- Tailwind CSS (design system)
- Responsive web design (mobile-friendly)

**Backend:**
- Node.js + Express.js (main API server - Port 5000)
- 6 Microservice Engines (Ports 8081-8086)
  - IAM Engine (8081): Authentication, multi-tenant, RBAC
  - Assessment Engine (8082): Template management, scoring
  - Planner Engine (8083): OKR generation, OpenAI integration
  - Scoring Engine (8084): Progress tracking, analytics
  - Observer Engine (8085): Activity logging, audit trail
  - Tracking Engine (8086): Task management, updates

**Database:**
- MongoDB (primary data store)
- Collections: companies, users, assessments, templates, objectives, tasks

**AI Integration:**
- OpenAI API (GPT-4)
- Endpoint: `/api/okr/generate` calls OpenAI with structured prompt
- Fallback: Template-based OKRs if API unavailable

**Infrastructure:**
- Development: Local (Mac, ports 3000, 5000, 8081-8086)
- Production: Docker + Kubernetes (planned)
- Version Control: Git + GitHub

---

## 📋 MVP SCREEN STRUCTURE (22 Screens)

### **Sprint 1: Assessment Framework & User Onboarding (Weeks 1-2)**

#### **Admin/Setup Screens (3):**
1. `admin_01_assessment_templates.html` - Browse 6 templates, create custom
2. `admin_02_template_builder.html` - Drag-drop categories, questions, formula editor
3. `admin_03_role_management.html` - Assign roles, manage permissions

#### **Owner Workflow (5):**
4. `owner_01_signup_business_profile.html` - Company setup, select archetype (16 options)
5. `owner_02_strategic_preferences.html` - Select focus areas, set primary/secondary
6. `owner_03_take_assessment.html` - Complete selected template (progressive UI)
7. `owner_04_assessment_results.html` - View scores, AI insights, "Generate OKRs" CTA
8. `owner_05_invite_team.html` - Invite with role/function, assign assessments

#### **Employee Workflow (3):**
9. `employee_01_registration.html` - Register via invite link
10. `employee_02_take_assessment.html` - Complete assigned assessment
11. `employee_03_assessment_results.html` - View personal scores

---

### **Sprint 2: OKR Generation & Manager Planning (Weeks 3-4)**

#### **OKR Generation (3):**
12. `okr_01_generate_objectives.html` - AI generates from assessment + preferences
13. `okr_02_review_objectives.html` - Owner edits, approves, rejects suggestions
14. `okr_03_objective_library.html` - All company objectives, status, assignments

#### **Manager Planning (3):**
15. `manager_01_planning_dashboard.html` - Select OKRs, view team, assign tasks
16. `manager_02_add_team_member.html` - Invite to team, set function
17. `manager_03_task_assignment.html` - Break KRs into tasks, assign to people

---

### **Sprint 3: Execution Dashboards & Task Management (Weeks 5-6)**

#### **Daily Dashboards (3):**
18. `dashboard_owner.html` - Business health, OKR progress, team overview
19. `dashboard_manager.html` - Team progress, action queue, approvals
20. `dashboard_employee.html` - My 3 tasks today, progress, recognition

#### **Task Management (2):**
21. `my_objectives.html` - View all my OKRs, drill down to tasks
22. `task_detail.html` - Complete task, see KR/Objective context

---

### **Consultant Screens (Integrated into above):**
- Consultant uses same screens with multi-company selector
- Additional: Company switcher dropdown in navigation
- Additional: "My Clients" dashboard showing all company health scores

---

## 🔄 USER FLOWS

### **1. Owner Onboarding & OKR Setup (30-45 minutes)**

```
Step 1: Sign Up (5 min)
  → Enter email, password, company name
  → Select business archetype (16 options)
  → Set company size, growth stage, revenue model

Step 2: Strategic Preferences (3 min)
  → Select focus areas (unlimited, mark primary/secondary)
  → "Client Acquisition" (Primary)
  → "Service Delivery" (Primary)
  → "Team Development" (Secondary)
  → "Innovation" (Secondary)

Step 3: Choose Assessment Template (2 min)
  → Browse 6 pre-built templates
  → Select "Speed/Strength/Intelligence" (default)
  → Or customize/create new template

Step 4: Take Business Assessment (15-20 min)
  → Complete 15-21 questions
  → Progress indicator
  → Save & continue option

Step 5: View Results (5 min)
  → Speed: 81/100 ✅
  → Strength: 68/100 ⚠️
  → Intelligence: 72/100 ⚠️
  → AI insights: "Strength needs improvement"

Step 6: Generate OKRs (2 min)
  → Click "Generate OKRs"
  → OpenAI processes:
    - Assessment results
    - Business archetype (B2B Professional Services)
    - Strategic preferences (4 focus areas)
  → Displays 4-6 suggested objectives

Step 7: Review & Approve OKRs (5 min)
  → Review AI rationale
  → Edit titles, KRs if needed
  → Approve or regenerate
  → OKRs added to library

Step 8: Invite Team (5 min)
  → Add team member emails
  → Assign roles (Manager/Employee)
  → Assign assessments
  → Send invites
```

---

### **2. Manager Planning Flow (20-30 minutes)**

```
Step 1: Register via Invite (2 min)
  → Click invite link
  → Create account
  → Auto-assigned to company + role

Step 2: Take Assessment (10-15 min)
  → Complete assigned assessment
  → View personal results
  → Dashboard unlocks

Step 3: Access Planning Dashboard (1 min)
  → See available objectives (from owner)
  → "Strengthen Financial Foundation"
  → "Build High-Performance Team"
  → "Accelerate Client Acquisition"

Step 4: Select OKRs for Team (5 min)
  → Check boxes for relevant objectives
  → "Build High-Performance Team" ✅
  → "Accelerate Client Acquisition" ✅
  → System shows KRs under each

Step 5: Add Team Members (2 min)
  → Click "+ Add Team Member"
  → Enter emails, roles
  → Send invites

Step 6: Assign Tasks (10 min)
  → KR: "Hire 3 senior specialists"
  → AI suggests tasks:
    - Draft job descriptions (2 days) → Assign to self
    - Post on LinkedIn (1 day) → Assign to Sarah
    - Screen candidates (5 days) → Assign to John
  → Manager can edit, add, remove
  → Assign to team members
  → Set due dates
```

---

### **3. Employee Daily Workflow (5-10 minutes/day)**

```
Step 1: Login & View Dashboard
  → My 3 Tasks Today:
    1. Draft job description for senior designer
    2. Research competitor messaging
    3. Prepare for team standup

Step 2: Select Task
  → Click "Draft job description"
  → See context:
    - KR: "Hire 3 senior specialists"
    - Objective: "Build High-Performance Team"
    - Why: "Team capability scored 62/100, limiting growth"

Step 3: Complete Task
  → Mark "Complete"
  → Optional: Add notes
  → Progress auto-updates on KR

Step 4: View Progress
  → Personal dashboard shows:
    - 8 tasks completed this week
    - Contributing to 2 objectives
    - 🏆 "Fast Delivery" recognition
```

---

### **4. Consultant Multi-Company Workflow (15 min/company)**

```
Step 1: Sign Up as Consultant
  → Register with "Consultant" role
  → Complete profile
  → Dashboard shows "My Clients" (empty)

Step 2: Add Client Company
  → Click "+ Add Client"
  → Enter company details (on their behalf)
  → Select business archetype
  → Generate invite link for owner

Step 3: Customize Assessment Template
  → Create "Professional Services Deep Dive"
  → 7 categories, 35 questions
  → Custom formula: weighted with emphasis on team capability
  → Mark as "Available to all my clients"

Step 4: Assign Template to Clients
  → Company A: Use "Professional Services Deep Dive"
  → Company B: Use "Startup Health Check"
  → Company C: Use custom template

Step 5: Monitor Multiple Companies
  → Company switcher dropdown
  → Overview dashboard:
    - Company A: Speed 72, Strength 68, Intelligence 75
    - Company B: Speed 65, Strength 55, Intelligence 60
    - Company C: Speed 80, Strength 70, Intelligence 78
  → Click company to dive into details

Step 6: Generate OKRs for Client
  → Select Company A
  → Review assessment results
  → Generate OKRs (AI uses archetype + preferences)
  → Present to client owner for approval
```

---

## 🎨 16 BUSINESS ARCHETYPES - DEFINITIONS

### **B2B Archetypes:**

**1. B2B Professional Services**
- Examples: Consulting firms, agencies, law firms, accounting
- Key Focus: Client acquisition, delivery excellence, team expertise
- Typical Size: 10-200 employees
- OKR Priorities: Revenue per consultant, client retention, project margins

**2. B2B SaaS**
- Examples: Enterprise software, business tools, platforms
- Key Focus: ARR growth, churn reduction, product development
- Typical Size: 20-500 employees
- OKR Priorities: MRR growth, customer acquisition cost, feature adoption

**3. B2B Manufacturing**
- Examples: Industrial equipment, components, materials
- Key Focus: Production efficiency, supply chain, quality
- Typical Size: 50-500 employees
- OKR Priorities: Output volume, defect rate, delivery time

**4. B2B Distribution/Wholesale**
- Examples: Distributors, wholesalers, supply chain companies
- Key Focus: Inventory management, logistics, relationships
- Typical Size: 20-200 employees
- OKR Priorities: Inventory turnover, delivery speed, margin per unit

**5. B2B Technology Services**
- Examples: IT services, cloud infrastructure, MSPs
- Key Focus: Uptime, security, technical expertise
- Typical Size: 10-100 employees
- OKR Priorities: Service availability, incident response, customer satisfaction

**6. B2B Financial Services**
- Examples: Corporate banking, insurance, investment services
- Key Focus: Compliance, risk management, client trust
- Typical Size: 50-500 employees
- OKR Priorities: AUM growth, compliance score, client retention

**7. B2B Healthcare Services**
- Examples: Medical suppliers, healthcare IT, lab services
- Key Focus: Regulatory compliance, quality, patient outcomes
- Typical Size: 20-200 employees
- OKR Priorities: Regulatory compliance, error rate, turnaround time

**8. B2B Education/Training**
- Examples: Corporate training, e-learning, certifications
- Key Focus: Course completion, learner outcomes, content quality
- Typical Size: 5-50 employees
- OKR Priorities: Learner satisfaction, completion rate, content library size

---

### **B2C Archetypes:**

**9. B2C Retail/E-commerce**
- Examples: Online stores, marketplaces, physical retail
- Key Focus: Sales volume, customer experience, inventory
- Typical Size: 10-200 employees
- OKR Priorities: Conversion rate, AOV, customer lifetime value

**10. B2C SaaS/Digital Products**
- Examples: Consumer apps, digital tools, subscriptions
- Key Focus: User acquisition, engagement, monetization
- Typical Size: 5-100 employees
- OKR Priorities: MAU, retention rate, ARPU

**11. B2C Hospitality/Food Service**
- Examples: Restaurants, hotels, catering
- Key Focus: Customer satisfaction, operational efficiency, food quality
- Typical Size: 20-200 employees
- OKR Priorities: Customer reviews, table turnover, food cost %

**12. B2C Healthcare/Wellness**
- Examples: Clinics, gyms, wellness apps, supplements
- Key Focus: Patient outcomes, accessibility, customer health
- Typical Size: 5-100 employees
- OKR Priorities: Patient satisfaction, health outcomes, appointment availability

**13. B2C Education/Training**
- Examples: Online courses, tutoring, skills training
- Key Focus: Student success, course quality, affordability
- Typical Size: 2-50 employees
- OKR Priorities: Student completion rate, Net Promoter Score, course catalog

**14. B2C Entertainment/Media**
- Examples: Streaming, content creation, events
- Key Focus: Engagement, content quality, audience growth
- Typical Size: 5-100 employees
- OKR Priorities: Monthly active users, content output, engagement time

**15. B2C Professional Services**
- Examples: Personal coaching, financial advisors, home services
- Key Focus: Client results, service quality, referrals
- Typical Size: 1-20 employees
- OKR Priorities: Client satisfaction, referral rate, revenue per client

**16. B2C Manufacturing/Products**
- Examples: Consumer goods, handmade products, direct-to-consumer brands
- Key Focus: Product quality, brand awareness, distribution
- Typical Size: 5-50 employees
- OKR Priorities: Product reviews, repeat purchase rate, brand mentions

---

## 🧮 ASSESSMENT CALCULATION SYSTEM

### **Weighted Average Formula (Default):**

```javascript
// Category Score Calculation
categoryScore = (sum of (questionScore × questionWeight)) / (sum of questionWeights) × 100

// Overall Score Calculation
overallScore = (sum of (categoryScore × categoryWeight)) / 100

// Example:
// Speed Category (33.3% weight):
//   Q1: 80 points × 20% = 16
//   Q2: 75 points × 20% = 15
//   Q3: 60 points × 20% = 12
//   Q4: 100 points × 20% = 20
//   Q5: 90 points × 20% = 18
//   Category Score = (16+15+12+20+18) / 100 = 81/100

// Overall = (Speed×0.333 + Strength×0.333 + Intelligence×0.334)
```

---

### **Custom Formula Editor (Advanced):**

Admin can define custom formulas using JavaScript syntax:

```javascript
// Example: Emphasize weakest category
customFormula = `
  const minCategory = Math.min(speed, strength, intelligence);
  const avgCategory = (speed + strength + intelligence) / 3;
  return (minCategory * 0.5) + (avgCategory * 0.5);
`

// Example: Weighted with multipliers
customFormula = `
  return (speed * 0.4) + (strength * 0.3) + (intelligence * 0.3);
`

// Example: Penalty for imbalance
customFormula = `
  const avg = (speed + strength + intelligence) / 3;
  const variance = Math.abs(speed - avg) + Math.abs(strength - avg) + Math.abs(intelligence - avg);
  const balancePenalty = variance / 3;
  return avg - balancePenalty;
`
```

---

## 🤖 OPENAI INTEGRATION DETAILS

### **API Configuration:**

```javascript
const openai = require('openai');

const apiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7, // Balanced creativity/consistency
  maxTokens: 2500, // Enough for 4-6 objectives with KRs
};
```

### **Structured Prompt Template:**

```javascript
const generateOKRPrompt = (data) => `
You are a strategic business consultant specializing in OKR (Objectives and Key Results) design.

BUSINESS CONTEXT:
- Company: ${data.companyName}
- Archetype: ${data.archetype}
- Industry: ${data.industry}
- Size: ${data.companySize} employees
- Stage: ${data.growthStage}
- Revenue Model: ${data.revenueModel.join(', ')}

ASSESSMENT RESULTS:
${data.assessmentCategories.map(cat => `
- ${cat.name}: ${cat.score}/100 ${cat.score < 60 ? '[NEEDS ATTENTION]' : cat.score > 80 ? '[STRONG]' : '[MODERATE]'}
`).join('')}

Overall Health Score: ${data.overallScore}/100

WEAKEST AREAS (Priority for OKRs):
${data.weakestAreas.map(area => `- ${area.name}: ${area.score}/100 - ${area.insight}`).join('\n')}

OWNER'S STRATEGIC FOCUS AREAS:
Primary Priorities:
${data.primaryPreferences.map(p => `- ${p}`).join('\n')}

Secondary Priorities:
${data.secondaryPreferences.map(p => `- ${p}`).join('\n')}

CONSTRAINTS:
- Timeline: ${data.timeframe} (typically Q4 2024, 3 months)
- Current Team Capacity: ${data.teamCapacity}% utilized
- Budget Level: ${data.budgetLevel}

TASK:
Generate 4-6 quarterly objectives that:
1. **Address assessment weaknesses** (prioritize categories scoring <70)
2. **Align with owner's primary focus areas** (80% weight to primary)
3. **Are appropriate for ${data.archetype}** (use industry best practices)
4. **Follow OKR best practices** (ambitious, measurable, time-bound)
5. **Balance quick wins with strategic investments**

For each objective, provide:
{
  "title": "Clear, inspiring objective statement",
  "rationale": "Why this matters based on assessment (reference specific scores)",
  "focusArea": "Which strategic preference this addresses",
  "difficultyLevel": "Easy|Medium|Hard|Stretch",
  "estimatedEffort": "% of team capacity required",
  "timeframe": "When to complete (typically end of quarter)",
  "keyResults": [
    {
      "description": "Specific, measurable outcome",
      "metric": "What you're measuring",
      "baseline": "Current state (from assessment if available)",
      "target": "Ambitious but achievable target",
      "measurementFrequency": "Weekly|Monthly|End of quarter"
    }
  ]
}

Return ONLY valid JSON array of objectives. No markdown, no explanation outside JSON.
`;
```

### **Fallback Strategy:**

If OpenAI API fails:
1. Use template-based OKRs (pre-written for each archetype)
2. Show user: "AI unavailable, showing template OKRs. You can customize."
3. Log error for debugging
4. Retry API call in background

---

## 📊 SUCCESS METRICS (MVP)

### **Technical Metrics:**
- ✅ All 6 assessment templates functional
- ✅ Custom template builder: >80% features working
- ✅ OpenAI OKR generation: <5 second response time
- ✅ 99% uptime during testing period
- ✅ Mobile responsive: works on screens 375px+

### **User Experience Metrics:**
- ✅ Owner onboarding: <45 minutes end-to-end
- ✅ Assessment completion rate: >80%
- ✅ OKR generation satisfaction: >4/5 rating
- ✅ Manager planning time: <30 minutes
- ✅ Employee daily task clarity: >4.5/5 rating

### **Business Metrics:**
- ✅ 10 beta companies onboarded
- ✅ 100+ total users (owners, managers, employees)
- ✅ 50+ assessments completed
- ✅ 200+ OKRs generated
- ✅ 3+ consultants with multi-company access

---

## 🚧 KNOWN RISKS & MITIGATION

### **Risk 1: OpenAI API Costs**
- **Impact**: High usage could increase costs
- **Mitigation**:
  - Implement caching (same input = cached response)
  - Rate limiting per company
  - Freemium model (limited generations/month)

### **Risk 2: Custom Formula Complexity**
- **Impact**: Users create broken formulas
- **Mitigation**:
  - Provide formula templates
  - JavaScript syntax validator
  - Test with sample data before saving
  - Fallback to weighted average if error

### **Risk 3: 16 Archetypes Too Many**
- **Impact**: User confusion in selection
- **Mitigation**:
  - Smart wizard (B2B vs B2C first, then subcategory)
  - "Not sure? Take quiz" option
  - Default to "B2B Professional Services" for fastest path

### **Risk 4: Consultant Multi-Company UX**
- **Impact**: Switching companies is cumbersome
- **Mitigation**:
  - Persistent company selector in nav (always visible)
  - Recent companies quick-switch
  - Keyboard shortcut (Cmd+K → company search)

### **Risk 5: Assessment Fatigue**
- **Impact**: Users don't complete 15-21 questions
- **Mitigation**:
  - Progress bar with time estimate
  - Save & continue feature
  - Optional: AI pre-fills based on archetype (user confirms)

---

## 🎯 POST-MVP ROADMAP (Weeks 9-16)

### **Phase 2 Features:**
1. **Analytics Dashboard** (2 weeks)
   - Executive view: company health trends
   - Manager view: team performance
   - Charts, graphs, export to PDF

2. **Integrations** (2 weeks)
   - Slack: Daily task reminders
   - Google Workspace: Calendar sync
   - Microsoft Teams: Notifications

3. **Template Marketplace** (2 weeks)
   - Consultants sell templates
   - Revenue sharing (80/20 split)
   - Ratings and reviews

4. **Mobile Apps** (4 weeks)
   - React Native
   - iOS + Android
   - Push notifications

---

## ✅ MVP ACCEPTANCE CRITERIA

### **Must-Have (Blocking Launch):**
- [ ] All 6 assessment templates render correctly
- [ ] Custom template builder creates valid templates
- [ ] OpenAI generates 4-6 objectives with KRs
- [ ] Owner can invite team (email sends)
- [ ] Manager can assign tasks to team
- [ ] Employee sees today's tasks on dashboard
- [ ] All 5 roles have correct permissions
- [ ] Consultant can switch between companies
- [ ] Responsive design works on mobile (375px+)
- [ ] No critical bugs (data loss, security issues)

### **Should-Have (Can defer to week 9):**
- [ ] Custom formula editor fully functional
- [ ] Assessment results PDF export
- [ ] OKR progress charts
- [ ] Team member search/filter
- [ ] Bulk task assignment

### **Nice-to-Have (Post-MVP):**
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Undo/redo for OKR edits
- [ ] Assessment comparison over time

---

## 📅 8-WEEK TIMELINE

### **Week 1-2: Sprint 1 - Assessment Framework**
- Setup: Admin screens, template builder, role management
- Owner: Signup, business profile, take assessment, results
- Employee: Registration, take assessment, view results

### **Week 3-4: Sprint 2 - OKR Generation**
- OpenAI integration
- OKR generation, review, library screens
- Manager: Planning dashboard, add team, assign tasks

### **Week 5-6: Sprint 3 - Execution Dashboards**
- Role-based dashboards (Owner/Manager/Employee)
- Task detail, my objectives screens
- Daily workflow optimization

### **Week 7: Integration & Testing**
- End-to-end testing all user flows
- Bug fixes
- Performance optimization
- Consultant multi-company testing

### **Week 8: Launch Preparation**
- Beta user onboarding
- Documentation
- Marketing materials
- Production deployment

---

## 🎉 MVP SUCCESS = STRATEGIC FOUNDATION

This MVP isn't just a feature list—it's a **strategic platform** that:
1. ✅ Validates core value (assessment → OKRs workflow)
2. ✅ Enables consultants (multi-company, templates)
3. ✅ Differentiates from competitors (AI-driven, configurable)
4. ✅ Scales for growth (16 archetypes, unlimited focus areas)
5. ✅ Creates network effects (consultants bring clients)

**Launch Success Criteria**: 10 paying companies + 3 consultants by Dec 31, 2025

---

**Document Owner**: Product Team
**Last Updated**: October 1, 2025
**Next Review**: Weekly during development
