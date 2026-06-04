# 🎯 MASTER KARVIA BUSINESS DEVELOPMENT LIST (FINAL)

**Version**: 2.0 (Aligned with MVP_STRATEGY_FINAL.md)
**Created**: October 1, 2025
**Product**: Karvia Business - Assessment-Driven OKR Platform
**MVP Launch**: November 30, 2025 (8 weeks + Week 0)
**Beta Launch**: Q1 2026 (Post-MVP)

---

## 📊 PROGRESS OVERVIEW

### **🔴 REALITY CHECK - January 13, 2025**
**Current Completion**: 45-50% of MVP functionality
**Status**: Week 0 NOT STARTED (documented as complete but code analysis shows gaps)
**Critical Blockers**: 4 models missing, 2 API routes are placeholders

### **Week 0** (BLOCKING): ⬜⬜⬜⬜⬜ 0/5 days - **NOT STARTED**
### **MVP Progress**: ████⬜⬜⬜⬜ ~45% infrastructure, 0% core features (4/8 weeks equivalent)
### **MVP Tasks**: 89 tasks total
   - ✅ 35 tasks complete (infrastructure, models, engines)
   - ❌ 54 tasks pending (Goals, Tasks, OpenAI integration, invitations)
### **Beta Backlog**: 67 items (Post-MVP features)

**SEE**: [IMPLEMENTATION_STATUS_REPORT.md](./IMPLEMENTATION_STATUS_REPORT.md) for detailed analysis

---

## 🚨 WEEK 0: TECHNICAL DEBT RESOLUTION (PREREQUISITE)

**Duration**: 5 days
**Status**: BLOCKING - Must complete before Week 1
**Reference**: `WEEK_0_MIGRATION_GUIDE.md`, `STANDALONE_MODE_CONFIGURATION.md`

### **Day 1-2: Create Missing Models (PRIORITY 1)**

**🔴 CURRENT STATUS**: 4 critical models MISSING from server/models/
**DECISION**: Skip shared-models migration for now, create models locally first
**RATIONALE**: Faster to market, can refactor to shared-models in Beta

- [ ] **Day 1 Morning: Create Goal Model** (4 hours)
  - [ ] File: server/models/Goal.js
  - [ ] Schema: goal_id, objective_id, name, description, owner_id, quarter (enum), week (1-13), progress (0-100), status (enum), created_at, updated_at
  - [ ] Indexes: objective_id, owner_id, quarter, status
  - [ ] Methods: updateProgress(), calculateHealth(), isOverdue()
  - [ ] Validators: quarter enum [Q1,Q2,Q3,Q4], week 1-13, progress 0-100
  - [ ] Reference: Similar to Objective.js structure (417 lines)
  - **Estimate**: 4 hours (model: 200-250 lines)

- [ ] **Day 1 Afternoon: Create Task Model** (4 hours)
  - [ ] File: server/models/Task.js
  - [ ] Schema: task_id, goal_id, objective_id (ref), name, description, assigned_to, assigned_by, due_date, status (enum), priority (enum), completion_date, blocked_reason
  - [ ] Indexes: goal_id, assigned_to, due_date, status, priority
  - [ ] Methods: complete(), defer(), markBlocked(), isOverdue(), getDaysRemaining()
  - [ ] Validators: status enum [not_started, in_progress, completed, blocked, deferred], priority enum [low, medium, high, urgent]
  - [ ] Cascading: Auto-update Goal progress when Task status changes
  - **Estimate**: 4 hours (model: 250-300 lines)

- [ ] **Day 2 Morning: Create Invitation Model** (3 hours)
  - [ ] File: server/models/Invitation.js
  - [ ] Schema: token (unique, indexed), inviter_id, invitee_email, invitee_name, role, business_id, expires_at, status (enum), accepted_at, registered_user_id
  - [ ] Indexes: token (unique), invitee_email, business_id, status
  - [ ] Methods: isExpired(), accept(), extend(), resend()
  - [ ] Token generation: crypto.randomBytes(32).toString('hex')
  - [ ] Default expiry: 7 days from creation
  - [ ] Validators: status enum [pending, accepted, expired, revoked]
  - **Estimate**: 3 hours (model: 150-180 lines)

- [ ] **Day 2 Afternoon: Create Assessment Model** (3 hours)
  - [ ] File: server/models/Assessment.js
  - [ ] Schema: assessment_id, business_id, submitted_by, assessment_type (enum), template_id, responses (array), scores (Speed/Strength/Intelligence), overall_score, weak_areas (array), completed_at
  - [ ] Indexes: business_id, submitted_by, completed_at
  - [ ] Methods: calculateScores(), identifyWeakAreas(), generateOKRSuggestions()
  - [ ] Link to Business model: Add reference to store history
  - [ ] Note: Business.js already has embedded assessment_scores, this adds history tracking
  - **Estimate**: 3 hours (model: 180-200 lines)

- [ ] **Day 2 End: Model Testing** (2 hours)
  - [ ] Create test data for Goal model (CRUD operations)
  - [ ] Create test data for Task model (cascading updates)
  - [ ] Test Invitation token generation/validation
  - [ ] Test Assessment score calculation
  - [ ] Manual testing via Postman/Thunder Client

**Acceptance**: 4 models exist, all have proper schemas/indexes/methods, CRUD operations tested

**⚠️ DEFERRED TO BETA**: Shared-models package migration (Week 0 original plan)
- Reason: Adds 2 days to timeline, can be done post-MVP
- Current approach: Models in server/models/, engines reference via relative path
- Beta refactor: Create @karvia/shared-models when scaling to external deployment

---

### **Day 3-4: Feature Flags & Standalone Mode**

- [ ] **Feature Flag Service**
  - [ ] Create `server/services/feature-flags.js`
  - [ ] Implement flag validation at startup
  - [ ] Add flags: OPENAI, REDIS, NATS, IBRAIN, EMAIL
  - [ ] Create `.env.example` with all flags

- [ ] **OpenAI Configuration**
  - [ ] Create `engines/planner/config/ai-config.js`
  - [ ] Implement multi-provider support (OpenAI, Anthropic, Custom)
  - [ ] Add template-based fallback
  - [ ] Test OpenAI disabled mode

- [ ] **Cache Service**
  - [ ] Create `server/services/cache-service.js`
  - [ ] Implement Redis mode
  - [ ] Implement in-memory fallback mode
  - [ ] Test cache with Redis disabled

- [ ] **iBrain Integration**
  - [ ] Create `engines/tracking/config/ibrain-config.js`
  - [ ] Implement webhook bypass when disabled
  - [ ] Update AgentIntegrationService with guards
  - [ ] Test tracking engine without iBrain

- [ ] **Invitation Service**
  - [ ] Implement email mode (SendGrid/NodeMailer)
  - [ ] Implement manual provisioning mode
  - [ ] Add token generation and validation
  - [ ] Create manual-provision API endpoint

- [ ] **Standalone Configuration**
  - [ ] Create `.env.standalone` template
  - [ ] Create `docker-compose.standalone.yml`
  - [ ] Create `scripts/start-standalone.sh`
  - [ ] Test platform with only MongoDB

**Acceptance**: Platform runs in 3 modes (Full Stack, Standalone, Hybrid), all feature flags functional.

---

### **Day 5: Docker & CI Updates**

- [ ] **Docker Configuration**
  - [ ] Update `Dockerfile.engines` (shared-models copy)
  - [ ] Fix `docker-compose.yml` (healthchecks, remove invalid volumes)
  - [ ] Add NATS service (for future Beta)
  - [ ] Test all engines build successfully

- [ ] **CI/CD Pipeline**
  - [ ] Update `.github/workflows/test.yml` for workspaces
  - [ ] Add shared-models tests to pipeline
  - [ ] Add engine tests to pipeline
  - [ ] Test CI passes with workspace setup

- [ ] **Security Hardening**
  - [ ] Create `scripts/generate-secrets.sh`
  - [ ] Remove all hard-coded secrets from codebase
  - [ ] Add config validation (fail-fast if secrets missing)
  - [ ] Test with invalid config (should exit with error)

- [ ] **Documentation**
  - [ ] Complete WEEK_0_MIGRATION_GUIDE.md checklist
  - [ ] Complete STANDALONE_MODE_CONFIGURATION.md
  - [ ] Update README.md with deployment modes
  - [ ] Create admin guide for feature flags

**Acceptance**: `docker-compose up` starts all services, no hard-coded secrets, CI passes.

---

## 🚀 MVP TODOS (Nov 30, 2025 Launch)

**Reference**: `MVP_STRATEGY_FINAL.md`
**Scope**: 15 core screens, 5 roles, template-based OKRs (or OpenAI if enabled)

---

### **WEEK 1-2: COMPLETE OKR CASCADE + OPENAI**

#### **Goals API & Model** (Week 1)

- [ ] **Routes Implementation** (`server/routes/goals.js`)
  - [ ] GET `/api/goals` - List goals (with filters: objective_id, assigned_to, status, quarter, week)
  - [ ] POST `/api/goals` - Create goal
  - [ ] GET `/api/goals/:id` - Get goal details
  - [ ] PUT `/api/goals/:id` - Update goal
  - [ ] DELETE `/api/goals/:id` - Delete goal
  - [ ] PUT `/api/goals/:id/progress` - Update progress percentage

- [ ] **Business Logic**
  - [ ] Validate goal belongs to valid objective
  - [ ] Validate assigned_to user exists
  - [ ] Auto-calculate progress from tasks
  - [ ] Update objective progress when goals change

- [ ] **Authorization**
  - [ ] Manager can create goals for their team
  - [ ] Employee can view assigned goals
  - [ ] Company Admin can view all goals
  - [ ] Consultant can manage goals for active company

- [ ] **Testing**
  - [ ] Integration test: Create goal → Update progress → Check objective updated
  - [ ] Test filters (by objective, user, status)
  - [ ] Test authorization rules

**Acceptance**: Manager can create goals from key results, progress cascades to objective.

---

#### **Tasks API & Model** (Week 1)

- [ ] **Routes Implementation** (`server/routes/tasks.js`)
  - [ ] GET `/api/tasks` - List tasks (with filters: goal_id, assigned_to, status, due_date)
  - [ ] POST `/api/tasks` - Create task
  - [ ] GET `/api/tasks/:id` - Get task details
  - [ ] PUT `/api/tasks/:id` - Update task
  - [ ] DELETE `/api/tasks/:id` - Delete task
  - [ ] PUT `/api/tasks/:id/complete` - Mark task complete
  - [ ] GET `/api/tasks/my-tasks` - Get my tasks (today + overdue)
  - [ ] POST `/api/tasks/ai-suggest` - AI task suggestions (if OpenAI enabled)

- [ ] **Business Logic**
  - [ ] Validate task belongs to valid goal
  - [ ] Auto-update goal progress when task completed
  - [ ] Calculate overdue tasks
  - [ ] Track completion timestamps

- [ ] **AI Integration** (if FEATURE_OPENAI_ENABLED=true)
  - [ ] Implement AI task suggestion endpoint
  - [ ] Build prompt with goal context
  - [ ] Parse OpenAI response into tasks
  - [ ] Cache suggestions (1 hour)

- [ ] **Testing**
  - [ ] Integration test: Create task → Mark complete → Check goal progress updated
  - [ ] Test AI suggestions (if enabled)
  - [ ] Test my-tasks endpoint (returns correct user's tasks)

**Acceptance**: Employee can view and complete tasks, goal progress auto-updates.

---

#### **OpenAI Integration** (Week 2)

- [ ] **Planner Engine Updates** (`engines/planner/services/openai-service.js`)
  - [ ] Implement `generateObjectives(business, assessment)` method
  - [ ] Build OKR generation prompt template
  - [ ] Call OpenAI GPT-4 API
  - [ ] Parse JSON response
  - [ ] Validate objectives structure

- [ ] **Caching Layer** (Redis or in-memory)
  - [ ] Cache OKR generation results (24 hours)
  - [ ] Cache key: `okr:${businessId}:${assessmentId}`
  - [ ] Invalidate cache when new assessment submitted

- [ ] **Template Fallback**
  - [ ] Implement template-based OKR generation
  - [ ] Load templates from JSON files (`/templates/{archetype}.json`)
  - [ ] Select 4-6 templates based on weak assessment areas
  - [ ] Return fallback OKRs when OpenAI fails or disabled

- [ ] **API Endpoints**
  - [ ] POST `/api/objectives/generate` - Generate OKRs (OpenAI or templates)
  - [ ] POST `/api/goals/:id/suggest-tasks` - AI task suggestions

- [ ] **Testing**
  - [ ] Test with OpenAI enabled (real API call)
  - [ ] Test with OpenAI disabled (template fallback)
  - [ ] Test caching (second call returns cached result)
  - [ ] Test fallback when OpenAI fails (invalid API key)

**Acceptance**: OKRs generated via OpenAI (or templates), cached, fallback works.

---

### **WEEK 3-4: BUSINESS MODEL + INVITATION SYSTEM**

#### **Business Archetype & Preferences** (Week 3)

- [ ] **Business Model Updates**
  - [ ] Expand `archetype` enum to 16 options (8 B2B + 8 B2C)
  - [ ] Add `strategic_preferences` field (24 focus areas)
  - [ ] Add `preference_priority` field (primary/secondary)
  - [ ] Migration script for existing businesses

- [ ] **Signup Flow Updates**
  - [ ] Add archetype selector UI (dropdown of 16)
  - [ ] Add strategic preferences UI (checkboxes with primary/secondary weight)
  - [ ] Validate at least 2 primary and 2 secondary preferences selected

- [ ] **OKR Generation Integration**
  - [ ] Update OpenAI prompt to include archetype
  - [ ] Update prompt to prioritize primary preferences (80% weight)
  - [ ] Test generation with different archetypes

**Acceptance**: Owner selects archetype + preferences, OKRs reflect these choices.

---

#### **Invitation System** (Week 4)

- [ ] **IAM Engine Updates** (`engines/iam/services/invitation-service.js`)
  - [ ] Implement `createInvitation(inviterUserId, inviteeEmail, role, businessId)` method
  - [ ] Generate secure token (crypto.randomBytes)
  - [ ] Set expiry (7 days from creation)
  - [ ] Save invitation to database

- [ ] **Email Integration** (if FEATURE_EMAIL_ENABLED=true)
  - [ ] Configure SendGrid or NodeMailer
  - [ ] Create invitation email template
  - [ ] Send email with registration link
  - [ ] Handle email send failures

- [ ] **Manual Provisioning** (if FEATURE_EMAIL_ENABLED=false)
  - [ ] POST `/api/users/manual-provision` endpoint
  - [ ] Admin creates user directly with password
  - [ ] Return success with instructions to share credentials

- [ ] **Registration Flow**
  - [ ] GET `/api/invite/:token` - Validate token
  - [ ] POST `/api/register` - Accept invitation and create account
  - [ ] Mark invitation as accepted
  - [ ] Auto-login after registration

- [ ] **Frontend Screens**
  - [ ] Owner invite screen (`owner_invite.html`)
  - [ ] Registration screen (`invite_register.html`)
  - [ ] Manual provisioning UI (Admin panel)

**Acceptance**: Owner invites team, invitee receives email (or manual token), registers successfully.

---

### **WEEK 5-6: ROLE-BASED DASHBOARDS**

#### **5-Role Permissions** (Week 5)

- [ ] **Authorization Middleware**
  - [ ] Implement `hasPermission(resource, action)` middleware
  - [ ] Enforce on all API routes
  - [ ] Test unauthorized access returns 403

- [ ] **Permission Matrix**
  | Resource | Company Admin | Manager | Employee | Consultant |
  |----------|---------------|---------|----------|------------|
  | Assessments | View all, Create | View team, Create | View own | View company |
  | Objectives | CRUD all | View team | View assigned | CRUD company |
  | Goals | CRUD all | CRUD team | View assigned | View company |
  | Tasks | CRUD all | CRUD team | CRUD assigned | View company |
  | Users | Invite, Manage | Invite to team | View team | View company |

- [ ] **Consultant Multi-Company**
  - [ ] User.companies array (multiple company IDs)
  - [ ] User.active_company_id (currently viewing)
  - [ ] POST `/api/users/switch-company` endpoint
  - [ ] Scoped queries filter by active_company_id

**Acceptance**: Each role sees only authorized data, consultant can switch companies.

---

#### **Frontend Screens** (Week 5-6)

**Owner Screens (5):**
- [ ] `owner_signup.html` - Company signup with archetype + preferences
- [ ] `owner_assessment.html` - Take Speed/Strength/Intelligence assessment
- [ ] `owner_results.html` - Assessment results with 3 gauges + "Generate OKRs" button
- [ ] `owner_review_okrs.html` - Review AI-generated OKRs, edit, approve
- [ ] `owner_invite.html` - Invite team members (email or manual)

**Manager Screens (4):**
- [ ] `manager_dashboard.html` - Team progress, action queue, my tasks today
- [ ] `manager_planning.html` - Select objectives, assign goals to team, AI suggest tasks
- [ ] `manager_team.html` - Team member cards, status, capacity
- [ ] `manager_tasks.html` - Create tasks from goals, assign to team

**Employee Screens (3):**
- [ ] `employee_dashboard.html` - My 3 tasks today (large cards with context)
- [ ] `employee_objectives.html` - All assigned objectives, progress bars
- [ ] `employee_task_detail.html` - Task detail, complete/defer/comment

**Consultant Screens (2):**
- [ ] `consultant_clients.html` - All client companies, health scores, switch company
- [ ] `consultant_company_view.html` - Same as owner dashboard for selected company

**Shared (1):**
- [ ] `invite_register.html` - Token-based registration with password setup

**Data Binding**:
- [ ] Connect all screens to APIs
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all user flows

**Acceptance**: All 15 screens functional, data-bound to APIs, role-based navigation works.

---

### **WEEK 7: INTEGRATION TESTING**

#### **End-to-End Flows**

- [ ] **Owner Flow**
  - [ ] Signup → Select archetype + preferences
  - [ ] Take assessment → View results
  - [ ] Generate OKRs → Review and approve
  - [ ] Invite 3 team members (1 manager, 2 employees)
  - [ ] Verify invitations sent/created

- [ ] **Manager Flow**
  - [ ] Register via invitation link
  - [ ] Login and view assigned objectives
  - [ ] Select 2 objectives for team
  - [ ] Break into weekly goals
  - [ ] Use AI to suggest tasks
  - [ ] Assign tasks to employees

- [ ] **Employee Flow**
  - [ ] Register via invitation link
  - [ ] Login and see dashboard with 3 tasks
  - [ ] View task context (linked to KR → Objective)
  - [ ] Complete 2 tasks
  - [ ] Verify goal progress updated

- [ ] **Consultant Flow**
  - [ ] Login with multi-company access
  - [ ] View client list with health scores
  - [ ] Switch to Company A
  - [ ] Generate OKRs for Company A
  - [ ] Switch to Company B
  - [ ] Verify data scoped correctly

#### **Edge Cases & Bug Fixes**

- [ ] Test with missing data (empty assessments, no objectives)
- [ ] Test with large data (1000 objectives, 10000 tasks)
- [ ] Test concurrent access (2 managers editing same goal)
- [ ] Test OpenAI failures (invalid API key, timeout)
- [ ] Test invitation expiry (7 days old)
- [ ] Test invalid tokens
- [ ] Test unauthorized access attempts

#### **Performance Testing**

- [ ] Dashboard loads in <2 seconds (with 100 objectives)
- [ ] API response time <200ms (p90)
- [ ] OpenAI response time <5 seconds
- [ ] Database query optimization (add missing indexes)

#### **Security Audit**

- [ ] Test JWT token expiry and refresh
- [ ] Test authorization (users can't access other companies)
- [ ] Test input validation (SQL injection, XSS)
- [ ] Test invitation token security
- [ ] Test password strength requirements

**Acceptance**: All flows work end-to-end, no critical bugs, performance meets targets.

---

### **WEEK 8: LAUNCH PREPARATION**

#### **Documentation**

- [ ] **User Guides**
  - [ ] Owner guide (signup → OKR generation → team invite)
  - [ ] Manager guide (planning → goal assignment → task management)
  - [ ] Employee guide (daily tasks → objective contribution)
  - [ ] Consultant guide (multi-company management)

- [ ] **API Documentation**
  - [ ] OpenAPI/Swagger spec for all endpoints
  - [ ] Authentication guide (JWT)
  - [ ] Error codes reference

- [ ] **Admin Guide**
  - [ ] Feature flags configuration
  - [ ] Manual user provisioning
  - [ ] Troubleshooting common issues
  - [ ] Backup and restore procedures

- [ ] **Deployment Guide**
  - [ ] Production environment setup
  - [ ] Docker Compose configuration
  - [ ] Environment variables reference
  - [ ] Secrets management (`.env` file)

#### **Beta User Onboarding**

- [ ] **Recruit Beta Users**
  - [ ] 5 beta companies (different industries)
  - [ ] 2 consultants with multiple clients
  - [ ] Mix of team sizes (5-50 employees)

- [ ] **Onboarding Sessions**
  - [ ] Schedule 1-hour demo per company
  - [ ] Walkthrough: Signup → Assessment → OKRs → Team setup
  - [ ] Answer questions and collect feedback

- [ ] **Feedback Collection**
  - [ ] Create feedback form
  - [ ] Weekly check-ins with beta users
  - [ ] Bug tracking system (GitHub Issues)

#### **Production Deployment**

- [ ] **Infrastructure Setup**
  - [ ] Provision production servers (AWS/GCP/Render)
  - [ ] Configure domain (app.karvia.com)
  - [ ] Set up SSL certificate (Let's Encrypt)
  - [ ] Configure firewall rules

- [ ] **Service Deployment**
  - [ ] Deploy MongoDB (MongoDB Atlas or self-hosted)
  - [ ] Deploy Redis (if enabled)
  - [ ] Deploy 6 engines (IAM, Assessment, Planner, Scoring, Observer, Tracking)
  - [ ] Deploy main server
  - [ ] Deploy NATS (for future Beta)

- [ ] **Monitoring & Alerts**
  - [ ] Set up Sentry (error tracking)
  - [ ] Set up Datadog/New Relic (performance monitoring)
  - [ ] Configure uptime monitoring (UptimeRobot)
  - [ ] Set up alert notifications (PagerDuty/Slack)

- [ ] **Backup & Recovery**
  - [ ] Configure MongoDB backups (daily)
  - [ ] Test restore procedure
  - [ ] Document disaster recovery plan

- [ ] **Load Testing**
  - [ ] Simulate 100 concurrent users
  - [ ] Test under load (500 requests/sec)
  - [ ] Identify bottlenecks
  - [ ] Optimize as needed

#### **Launch Checklist**

- [ ] All services deployed and healthy
- [ ] Domain resolves correctly (app.karvia.com)
- [ ] SSL certificate valid
- [ ] Email delivery working (if enabled)
- [ ] OpenAI integration working (if enabled)
- [ ] Monitoring alerts configured
- [ ] Beta users can access platform
- [ ] Support channel established (email/Slack)
- [ ] Backup system tested
- [ ] Rollback plan documented

**Acceptance**: Platform live at production URL, 5 beta companies onboarded, no critical issues.

---

## 📊 MVP SUCCESS METRICS

### **Technical**
- ✅ All 15 core screens functional
- ✅ OpenAI generates 4-6 objectives in <5 seconds (if enabled)
- ✅ Goals & Tasks APIs 100% operational
- ✅ 5 roles with correct permissions
- ✅ Docker Compose deployment works (one command)
- ✅ 99% uptime during beta period
- ✅ <2s dashboard load time (p90)
- ✅ <200ms API response time (p90)

### **User Experience**
- ✅ Owner onboarding: <30 minutes (signup → generate OKRs)
- ✅ Assessment completion rate: >80%
- ✅ Manager planning time: <20 minutes (assign goals + tasks)
- ✅ Employee clarity: 4.5/5 (understand why tasks matter)

### **Business**
- ✅ 5 beta companies onboarded
- ✅ 50+ active users (mix of roles)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated (AI or templates)
- ✅ 2+ consultants managing multiple companies
- ✅ Zero critical data loss incidents
- ✅ <5% user-reported bugs

---

## 🎯 BETA BACKLOG (Post-MVP - Q1 2026)

**Reference**: `BETA_STRATEGY_FINAL.md`, `BETA_STRATEGY_ADDENDUM.md`

### **Phase 0: Architecture Foundation** (4 weeks - Dec 2025)

- [ ] Create `docs/contracts/` repository with JSON schemas
- [ ] Define event schemas (objective.created, goal.completed, etc.)
- [ ] Publish `@karvia/contracts` npm package
- [ ] Create `@karvia/engine-sdk` package (EngineClient, EventBus, CacheClient)
- [ ] Deploy NATS event bus
- [ ] Migrate databases (separate DB per engine)
- [ ] Backfill historical events
- [ ] Enable hybrid mode (DB + events)
- [ ] Audit engines for SDK compliance
- [ ] Refactor Scoring, Observer, Tracking engines (event-driven)

### **Phase 1: Enhanced Assessment System** (4 weeks - Jan 2026)

- [ ] Implement AssessmentTemplate model (MongoDB storage)
- [ ] Seed 5 additional system templates:
  - [ ] Balanced Scorecard
  - [ ] McKinsey 7S
  - [ ] Startup Health Check
  - [ ] Service Business Maturity
  - [ ] E-commerce Readiness
- [ ] Build custom template builder UI (category + question CRUD)
- [ ] Implement custom formula engine (sandboxed mathjs)
- [ ] Build template marketplace (list, purchase, install)
- [ ] Integrate Stripe for paid templates
- [ ] Implement 70/30 revenue share for consultants

### **Phase 2: Analytics & Insights** (4 weeks - Feb 2026)

- [ ] Implement DailySentiment model
- [ ] Create sentiment calculation service (keyword analysis)
- [ ] Build reflection modal UI (emoji + text input)
- [ ] Add individual sentiment circle to employee dashboard
- [ ] Add team sentiment circle to manager dashboard
- [ ] Implement team sentiment aggregation
- [ ] Create predictive analytics service (rule-based)
- [ ] Implement objective at-risk prediction
- [ ] Implement team burnout prediction
- [ ] Add health indicators dashboard (individual/team/company)
- [ ] Create horizontal AI insights carousel

### **Phase 3: Collaboration & Integrations** (4 weeks - Mar 2026)

- [ ] Add Socket.IO for WebSocket support
- [ ] Implement TaskComment model
- [ ] Build real-time task comments UI
- [ ] Add @mentions and notifications
- [ ] Implement activity feed
- [ ] Build Slack OAuth integration
- [ ] Implement Slack notifications (task assigned, objective at-risk)
- [ ] Build Slack bot commands (/karvia my-tasks)
- [ ] Implement Microsoft Teams integration
- [ ] Integrate Google Workspace (Calendar, Drive, Sheets)
- [ ] Plan mobile apps (React Native - separate project)

### **Phase 4: Enterprise Features** (4 weeks - Apr 2026)

- [ ] Implement granular permissions system
- [ ] Build Role model with permission matrix
- [ ] Create permission builder UI (admin panel)
- [ ] Implement Team model (hierarchical)
- [ ] Build org chart visualization
- [ ] Create sub-team management UI
- [ ] Build multi-company consultant dashboard
- [ ] Implement consultant templates library
- [ ] Create client reporting (PDF export)
- [ ] Add custom domain support (Let's Encrypt SSL)
- [ ] Implement custom email domain
- [ ] Build advanced white-label branding

### **Phase 5: Platform & AI Enhancements** (4 weeks - May 2026)

- [ ] Implement AI coaching chat (basic with OpenAI, advanced with iBrain)
- [ ] Build AICoachingSession model
- [ ] Create chat UI component
- [ ] Implement automated task breakdown
- [ ] Create OKR quality scoring
- [ ] Implement smart OKR recommendations
- [ ] Build Workflow model (trigger + actions)
- [ ] Create workflow builder UI (visual, drag-and-drop)
- [ ] Implement workflow execution engine
- [ ] Add performance optimization (caching, indexing)
- [ ] Build custom report builder
- [ ] Create executive dashboards
- [ ] Implement data export (JSON, CSV, Excel)

---

## 🚫 EXPLICITLY OUT OF SCOPE (MVP)

**These items were in original MASTER_KARVIA_BUSINESS_DEV_LIST.md but are DEFERRED to Beta:**

### **Deferred Assessment Features**:
- ❌ 5 additional assessment templates (ship 1 only for MVP)
- ❌ Custom template builder UI
- ❌ Custom formula editor (weighted average only for MVP)
- ❌ Template marketplace
- ❌ Template import/export

### **Deferred Analytics**:
- ❌ Sentiment analysis & reflection system
- ❌ Health indicators dashboard
- ❌ Predictive analytics
- ❌ Advanced charts and visualizations

### **Deferred Collaboration**:
- ❌ Task comments and discussions
- ❌ Real-time collaboration (WebSocket)
- ❌ Activity feed
- ❌ File attachments

### **Deferred Integrations**:
- ❌ Slack integration
- ❌ Microsoft Teams integration
- ❌ Google Workspace integration
- ❌ Time tracking integration (Clockify, Toggl)

### **Deferred Enterprise**:
- ❌ Granular permissions (custom roles)
- ❌ Sub-teams and hierarchies
- ❌ Org chart view
- ❌ Advanced consultant tools
- ❌ Custom domain + advanced white-label

### **Deferred AI/Automation**:
- ❌ AI coaching chat
- ❌ Workflow automation
- ❌ OKR quality scoring
- ❌ Advanced task breakdown

### **Deferred Mobile**:
- ❌ iOS app
- ❌ Android app
- ❌ Push notifications

### **Deferred Reporting**:
- ❌ Advanced analytics dashboards
- ❌ Custom report builder
- ❌ Executive dashboards
- ❌ BI tool integrations (Tableau, Power BI)

---

## 📝 NOTES & CLARIFICATIONS

### **Changed from Original Master List**:

1. **Week 0 Added**: Technical debt resolution is now prerequisite (shared models, feature flags, standalone mode)

2. **Scope Reduced**: From 156 MVP tasks to 89 tasks by removing:
   - 5 assessment templates (ship 1)
   - Custom template builder
   - Custom formula editor
   - All Beta features mistakenly in Sprint 1

3. **Focus Shifted**: From building everything to completing 10% gaps:
   - Goals API (placeholder → complete)
   - Tasks API (placeholder → complete)
   - OpenAI integration (missing → implemented with fallback)
   - Invitation system (missing → email + manual modes)

4. **React/Vite Deferred**: MVP uses static HTML with data binding, full React rebuild deferred to post-MVP

5. **Deployment Modes Added**: Platform can run in Full Stack, Standalone, or Hybrid modes

6. **Beta Clearly Separated**: All post-MVP features moved to Beta backlog with phases

---

## 🔗 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `MVP_STRATEGY_FINAL.md` | Main MVP strategy (8 weeks) |
| `MVP_STRATEGY_ADDENDUM.md` | Critical review resolutions |
| `WEEK_0_MIGRATION_GUIDE.md` | Shared models migration (5 days) |
| `STANDALONE_MODE_CONFIGURATION.md` | Feature flags and deployment modes |
| `BETA_STRATEGY_FINAL.md` | Post-MVP roadmap (Q1 2026) |
| `BETA_STRATEGY_ADDENDUM.md` | Beta architecture resolutions |

---

**Document Owner**: Engineering Lead
**Status**: LOCKED FOR IMPLEMENTATION
**Last Updated**: October 1, 2025
**Next Action**: Execute Week 0 tasks, then begin Week 1
