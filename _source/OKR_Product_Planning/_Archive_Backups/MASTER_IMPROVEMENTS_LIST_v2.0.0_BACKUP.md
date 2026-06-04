# 📝 MASTER IMPROVEMENTS LIST - Post-MVP Enhancements

**Status**: 📋 Planning (Beta & Future)
**Last Updated**: 2025-10-17 14:00:00
**Total Items**: 89 improvements (16 new from Week 2 deferred)
**Priority Distribution**: P0: 0 | P1: 30 | P2: 41 | P3: 18

---

## 🔗 RELATED LISTS

- **[Master Dev List](./MASTER_DEV_LIST.md)** - Active Nov 30 development (40 tasks)
- **[Master Issues List](./MASTER_ISSUES_LIST.md)** - Known issues & blockers (23 items)

**Sync Status**: ✅ Lists synchronized at 2025-10-13 18:28:15

---

## 📊 CATEGORIES

### By Phase:
- **Beta (Q1 2026)**: 35 items
- **Phase 2 (Q2 2026)**: 20 items
- **Future (Q3+ 2026)**: 12 items

### By Type:
- **Architecture**: 12 items (shared-models, NATS, service mesh)
- **Frontend**: 8 items (React migration, component library)
- **Features**: 28 items (iBrain modules, advanced analytics)
- **UX/UI**: 11 items (design polish, accessibility)
- **DevOps**: 5 items (CI/CD, monitoring)
- **Documentation**: 3 items (API docs, user guides)

---

## 🔧 WEEK 2 DEFERRED - PRODUCTION HARDENING ENHANCEMENTS

**Deferred Date**: October 17, 2025
**Reason**: Focus on customer-facing features for Nov 30 deadline. Week 2 TDD (completed) provides sufficient testing foundation.

### IMP-074: Enhanced Input Validation (Joi Integration)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-010 (Week 2 Day 2)
- **Description**: Complete Joi validation integration across all API endpoints
- **Status**: 75% complete (infrastructure ready, route integration pending)
- **Completed**:
  - ✅ Joi library installed
  - ✅ Validation middleware created
  - ✅ 4 comprehensive validator schemas (user, business, invitation, template)
- **Remaining**:
  - [ ] Integrate validators into routes (1h)
  - [ ] Test validation on critical endpoints (1h)
  - [ ] Create assessment and question validators (2h)
- **Why Deferred**: Basic validation exists in models, Joi is enhancement for better error messages
- **Links**: WEEK_2_DETAILED_PLAN.md:516-617

### IMP-075: Database Connection Hardening
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 hours
- **Original**: DEV-W2-011 (Week 2 Day 2)
- **Description**: Implement connection pooling, retry logic, and timeouts
- **Tasks**:
  - [ ] Configure connection pool (min 5, max 50)
  - [ ] Add connection retry logic (5 attempts, exponential backoff)
  - [ ] Set query timeouts (30s default, 60s configurable)
  - [ ] Monitor connection health with event listeners
  - [ ] Handle connection drops gracefully
  - [ ] Create health check endpoint (GET /health/db)
  - [ ] Implement graceful shutdown
- **Why Deferred**: Current connection works, this is optimization for high-load scenarios
- **Links**: WEEK_2_DETAILED_PLAN.md:620-695

### IMP-076: Database Index Optimization
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 hours
- **Original**: DEV-W2-012 (Week 2 Day 2)
- **Description**: Add indexes for query performance at scale
- **Tasks**:
  - [ ] User model indexes: email (unique), {business_id, role}, managed_businesses, manager_id
  - [ ] Invitation model indexes: invitation_token, {business_id, status}, {sent_by, created_at}, expires_at (TTL)
  - [ ] Assessment model indexes: {user_id, completed_at}, {template_id, business_id}, invitation_id
  - [ ] AssessmentTemplate model indexes: {business_id, is_active}, {is_global, is_active}, created_by
  - [ ] AssessmentQuestion model indexes: {dimension, category}, question_id (unique), is_active
  - [ ] Test query performance with `.explain()`
  - [ ] Target: All queries < 100ms
- **Why Deferred**: Performance optimization, not blocking for initial launch with small datasets
- **Links**: WEEK_2_DETAILED_PLAN.md:698-765

### IMP-077: Integration Test Suite Expansion
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-013 (Week 2 Day 3)
- **Description**: Complete end-to-end integration tests for Week 1 features
- **Status**: Infrastructure exists (312 test files), needs expansion
- **Tasks**:
  - [ ] Setup MongoDB Memory Server for isolated testing
  - [ ] Create test data factory functions
  - [ ] Test complete assessment flow (create template → invite → take → view results)
  - [ ] Test template management (create, duplicate, edit, delete)
  - [ ] Test invitation flow (send, accept, expire)
  - [ ] Test authentication flow (signup, login, validate)
  - [ ] Test role-based access (permissions, guards)
- **Why Deferred**: Week 2 TDD (completed) provides 39 unit tests covering critical paths
- **Links**: WEEK_2_DETAILED_PLAN.md:986-1075

### IMP-078: Unit Test Coverage to 85%
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 8 hours
- **Original**: DEV-W2-014 (Week 2 Day 3)
- **Description**: Increase unit test coverage from current 75% to 85%+ threshold
- **Status**: Current coverage ~70-75% for Week 2 Day 1 work
- **Completed** (Week 2 TDD):
  - ✅ SecretsManager tests (9 tests)
  - ✅ Logger tests (14 tests)
  - ✅ Error classes tests (16 tests)
  - ✅ ErrorHandler middleware tests (33 tests)
- **Remaining**:
  - [ ] Test remaining 7 error classes (ConflictError, RateLimitError, etc.)
  - [ ] Add tests for validators
  - [ ] Add tests for middleware (auth guards, rate limiters)
  - [ ] Add tests for services (business creation, invitation)
- **Why Deferred**: Critical paths covered by 39 existing unit tests
- **Links**: WEEK_2_DETAILED_PLAN.md:1077-1178

### IMP-079: Playwright E2E Test Suite
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-015 (Week 2 Day 3)
- **Description**: Browser-based end-to-end testing with Playwright
- **Tasks**:
  - [ ] Install Playwright
  - [ ] Configure test browsers (Chromium, Firefox, WebKit)
  - [ ] Write smoke tests for critical user flows
  - [ ] Test assessment creation flow
  - [ ] Test assessment taking flow
  - [ ] Test invitation acceptance flow
  - [ ] Setup CI integration
- **Why Deferred**: Manual testing sufficient for MVP, E2E better for Beta stability
- **Links**: WEEK_2_DETAILED_PLAN.md:1180-1248

### IMP-080: Monitoring & Alerting Setup
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-016 (Week 2 Day 4)
- **Description**: Production monitoring with health checks and error tracking
- **Tasks**:
  - [ ] Setup health check endpoints (/health, /health/db, /health/engines)
  - [ ] Integrate error tracking (Sentry or similar)
  - [ ] Setup performance monitoring (response times, slow queries)
  - [ ] Create alerting rules (error rates, downtime, performance)
  - [ ] Dashboard for system health
- **Why Deferred**: Basic logging exists, advanced monitoring for production scale
- **Links**: WEEK_2_DETAILED_PLAN.md:1292-1352

### IMP-081: GitHub Actions CI/CD Pipeline
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 hours
- **Original**: DEV-W2-017 (Week 2 Day 4)
- **Description**: Automated testing and deployment pipeline
- **Tasks**:
  - [ ] Create .github/workflows/test.yml (run tests on push/PR)
  - [ ] Create .github/workflows/deploy.yml (deploy to staging/production)
  - [ ] Setup status checks for PRs
  - [ ] Configure secrets management
  - [ ] Document workflow
- **Why Deferred**: Manual deployment acceptable for MVP timeline
- **Links**: WEEK_2_DETAILED_PLAN.md:1354-1406

### IMP-082: API Documentation (Swagger/OpenAPI)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-018 (Week 2 Day 4)
- **Description**: Interactive API documentation for developers
- **Tasks**:
  - [ ] Install swagger-jsdoc and swagger-ui-express
  - [ ] Add JSDoc annotations to all routes
  - [ ] Configure Swagger UI at /api-docs
  - [ ] Document request/response schemas
  - [ ] Add authentication documentation
  - [ ] Export OpenAPI 3.0 spec
- **Why Deferred**: Internal team knows APIs, external docs for Beta partners
- **Links**: WEEK_2_DETAILED_PLAN.md:1408-1467

### IMP-083: Configuration Management System
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 3 hours
- **Original**: DEV-W2-019 (Week 2 Day 4)
- **Description**: Centralized configuration with validation
- **Tasks**:
  - [ ] Create config/index.js with validated config
  - [ ] Environment-specific configs (dev, staging, prod)
  - [ ] Config validation on startup
  - [ ] Runtime config reloading (optional)
  - [ ] Document all config options
- **Why Deferred**: Current .env approach works for MVP
- **Links**: WEEK_2_DETAILED_PLAN.md:1469-1518

### IMP-084: Code Quality Tools (ESLint, Prettier)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 hours
- **Original**: DEV-W2-020 (Week 2 Day 5)
- **Description**: Automated code formatting and linting
- **Tasks**:
  - [ ] Configure ESLint with recommended rules
  - [ ] Configure Prettier for code formatting
  - [ ] Add pre-commit hooks (husky + lint-staged)
  - [ ] Fix existing linting issues
  - [ ] Document coding standards
- **Why Deferred**: Manual code review sufficient for MVP timeline
- **Links**: WEEK_2_DETAILED_PLAN.md:1571-1621

### IMP-085: Deployment Documentation
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 hours
- **Original**: DEV-W2-021 (Week 2 Day 5)
- **Description**: Production deployment guides and runbooks
- **Tasks**:
  - [ ] Write deployment guide (step-by-step)
  - [ ] Create rollback procedures
  - [ ] Document environment setup
  - [ ] Create troubleshooting runbook
  - [ ] Write monitoring playbook
- **Why Deferred**: Team knows deployment process, formal docs for handoff
- **Links**: WEEK_2_DETAILED_PLAN.md:1623-1672

### IMP-086: Template Editing UI
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 6 hours
- **Original**: DEV-W2-023 (Week 1 deferred, Week 2 Day 5)
- **Description**: Allow users to edit existing assessment templates
- **Status**: Backend PUT endpoint exists, no frontend UI
- **Tasks**:
  - [ ] Create edit template page (reuse creation wizard)
  - [ ] Add "Edit" button to template cards in assessment hub
  - [ ] Load existing template data into form fields
  - [ ] Populate wizard steps with existing data (name, description, questions, weights)
  - [ ] Save changes via PUT /api/assessment-templates/:id
  - [ ] Show success message and redirect to template list
  - [ ] Handle validation (can't remove questions if assessments exist)
  - [ ] Test with templates that have existing assessments
- **Why Deferred**: Users can recreate templates as workaround, not blocking Nov 30
- **Why Important for Beta**: Common user request, improves UX significantly
- **Links**: WEEK_2_DETAILED_PLAN.md (Week 1 deferred ISS-W1-007)

### IMP-087: Template Duplication UI
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 hours
- **Original**: DEV-W2-024 (Week 1 deferred, Week 2 Day 5)
- **Description**: Allow users to duplicate templates for customization
- **Status**: Model has `duplicate()` method, no UI trigger
- **Tasks**:
  - [ ] Add "Duplicate" button to template cards
  - [ ] Create POST /api/assessment-templates/:id/duplicate endpoint
  - [ ] Backend creates copy with "(Copy)" appended to name
  - [ ] Redirect to edit page for new template
  - [ ] Show success message
  - [ ] Test duplication preserves all fields (questions, weights, settings)
  - [ ] Test with global templates → business-specific copy
  - [ ] Test with business templates → new business template
- **Why Deferred**: Can create new template manually as workaround
- **Why Important for Beta**: Common workflow - duplicate and customize
- **Links**: WEEK_2_DETAILED_PLAN.md (Week 1 deferred ISS-W1-008)

### IMP-088: Template Preview Before Publish
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 4 hours
- **Original**: DEV-W2-025 (Week 1 deferred, Week 2 Day 5)
- **Description**: Show full template preview before saving
- **Status**: Users can't see full question list before saving
- **Tasks**:
  - [ ] Add "Preview" step in template creation wizard (between Step 3 and save)
  - [ ] Display template summary (name, description, question count)
  - [ ] Show questions grouped by dimension (Speed/Strength/Intelligence)
  - [ ] Show dimension weights as percentages
  - [ ] Show estimated duration (e.g., "~20 minutes")
  - [ ] Show full question list with text (not just IDs)
  - [ ] Add "Back to Edit" button (returns to Step 3, preserves state)
  - [ ] Add "Publish Template" button (saves to database)
  - [ ] Responsive design for mobile
- **Why Deferred**: Users can review after creation, not critical for MVP
- **Why Important for Beta**: Users want to review before finalizing
- **Links**: WEEK_2_DETAILED_PLAN.md (Week 1 deferred nice-to-have)

### IMP-089: Enhanced Question Filtering in Template Builder
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 hours
- **Original**: DEV-W2-026 (Week 1 deferred, Week 2 Day 5)
- **Description**: Better question filtering and search in template builder
- **Status**: Basic question selection exists, no advanced filtering
- **Tasks**:
  - [ ] Add dimension filter dropdown (Speed/Strength/Intelligence/All)
  - [ ] Add category filter dropdown (or multi-select)
  - [ ] Add keyword search input (searches question text)
  - [ ] Add sort options (by ID, by text, by category)
  - [ ] Filter questions in real-time as user types/selects
  - [ ] Show filtered count (e.g., "Showing 15 of 146 questions")
  - [ ] Persist filter state when navigating wizard steps
  - [ ] Clear filters button
  - [ ] Responsive design for mobile filters
- **Why Deferred**: All 146 questions are accessible, filtering is UX enhancement
- **Why Important for Beta**: With 146 questions, filtering is essential for usability
- **Links**: WEEK_2_DETAILED_PLAN.md (Week 1 deferred)

---

## 🏗️ ARCHITECTURE IMPROVEMENTS

### IMP-001: Shared-Models Package Migration
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Owner**: Engineering Lead
- **Description**: Create `@karvia/shared-models` npm package to decouple engines
- **Benefits**:
  - Independent engine deployment
  - Prevent schema drift
  - External party can deploy engines separately
- **Tasks**:
  - [ ] Setup npm workspaces
  - [ ] Create packages/shared-models/ directory
  - [ ] Migrate Business, User, Objective, Goal, Task models
  - [ ] Update all 6 engines to use shared package
  - [ ] Remove all `../../server/models` imports
  - [ ] Test independent engine deployment
- **Links**: From review Architecture_High_Level.md:14, nov30_mvp_review.md:4
- **Status**: Deferred from Week 0 (too complex for MVP deadline)

### IMP-002: NATS Event Bus Integration
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Owner**: Backend Architect
- **Description**: Replace direct engine communication with event-driven architecture
- **Benefits**:
  - Looser coupling between engines
  - Better scalability
  - Easier to add new engines
  - Async processing
- **Tasks**:
  - [ ] Deploy NATS server
  - [ ] Create @karvia/engine-sdk with EventBus client
  - [ ] Define event schemas (objective.created, goal.completed, etc.)
  - [ ] Refactor Scoring, Observer, Tracking engines for events
  - [ ] Backfill historical events
  - [ ] Test event-driven flows
- **Links**: MVP_STRATEGY_FINAL.md mentions NATS for Beta
- **Status**: Planned for Beta

### IMP-003: Service-to-Service Authentication
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Owner**: Security Engineer
- **Description**: Implement proper auth between microservices (not just user auth)
- **Tasks**:
  - [ ] Service API keys for each engine
  - [ ] Mutual TLS (mTLS) configuration
  - [ ] Service identity verification
  - [ ] Rate limiting between services
  - [ ] Document auth contracts
- **Links**: From review Architecture_High_Level.md:16
- **Status**: Planned for Beta

### IMP-004: Service Discovery Implementation
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Dynamic service discovery (Consul, etcd, or Kubernetes)
- **Benefits**: Engines can find each other dynamically, easier scaling
- **Status**: Planned for Phase 2

### IMP-005: Feature Flags Enhancement (Beyond MVP)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Expand feature flags beyond DEV-009 basic implementation
- **Tasks**:
  - [ ] Feature flag admin UI
  - [ ] User-level feature flags (A/B testing)
  - [ ] Gradual rollout capability
  - [ ] Feature flag analytics
- **Links**: DEV-009 implements basic flags for MVP
- **Status**: Enhancement after MVP

### IMP-006: Health Check & Circuit Breaker Patterns
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Implement health endpoints and circuit breakers for resilience
- **Tasks**:
  - [ ] Health check endpoints for all engines
  - [ ] Liveness and readiness probes
  - [ ] Circuit breaker for external API calls (OpenAI, iBrain)
  - [ ] Retry logic with exponential backoff
  - [ ] Fallback handling
- **Status**: Planned for Beta

### IMP-007: Database Per Engine (Microservices Best Practice)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 2 weeks
- **Description**: Each engine has its own database (not shared MongoDB)
- **Benefits**: True microservice independence, better scaling
- **Risks**: Data consistency challenges, more complex queries
- **Status**: Evaluate feasibility in Beta

### IMP-008: API Gateway Implementation
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Centralized API gateway (Kong, Tyk, or AWS API Gateway)
- **Benefits**: Rate limiting, auth, routing, monitoring in one place
- **Status**: Planned for Beta

### IMP-009: Docker Compose Standalone Mode Improvements
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Enhance docker-compose.standalone.yml (from DEV-009)
- **Tasks**:
  - [ ] Minimal services only (no Redis, no iBrain)
  - [ ] Volume mounts for data persistence
  - [ ] Better healthchecks
  - [ ] One-command deployment script
- **Links**: DEV-009 creates basic standalone mode
- **Status**: Enhancement after MVP

### IMP-010: Kubernetes Deployment
- **Priority**: P2 (MEDIUM)
- **Phase**: Phase 2 Q2 2026
- **Effort**: 2 weeks
- **Description**: Kubernetes manifests for production deployment
- **Status**: Planned for Phase 2

### IMP-011: Service Mesh (Istio/Linkerd)
- **Priority**: P3 (LOW)
- **Phase**: Future Q3 2026
- **Effort**: 3 weeks
- **Description**: Service mesh for observability, traffic management
- **Status**: Future consideration

---

## 🆕 WEEK 1 & WEEK 2 LEARNINGS & IMPROVEMENTS (Updated Oct 17)

### IMP-W2-010-COMPLETION: Complete Joi Validation Route Integration
- **Priority**: P1 (HIGH - Security)
- **Phase**: Week 2 (continuation of DEV-W2-010)
- **Effort**: 1 hour
- **Owner**: Backend Team
- **Status**: 75% Complete (Infrastructure done)
- **Description**: Integrate Joi validators into API routes
- **Context**: Week 2 Day 2 built complete Joi validation infrastructure (Oct 17, 2025)
- **Completed Work** (3 hours):
  - ✅ Installed Joi validation library
  - ✅ Created validation middleware (server/middleware/validate.js)
  - ✅ Created 4 comprehensive validator schemas:
    - server/validators/user.validator.js (signup, login, profile, roles)
    - server/validators/business.validator.js (create, update, query)
    - server/validators/invitation.validator.js (create, bulk, query, token)
    - server/validators/template.validator.js (create, update, duplicate + business logic)
  - ✅ Business logic validation (dimension weights sum to 1.0, duplicate questions, min counts)
  - ✅ Field-level error messages integrated with ValidationError class
- **Remaining Work** (~1 hour):
  - [ ] Integrate validators into routes (~15 endpoints, 4 min each)
  - [ ] routes/auth.js (signup, login, change-password)
  - [ ] routes/invitations.js (create, bulk create, validate token, accept)
  - [ ] routes/assessmentTemplates.js (create, update, duplicate)
  - [ ] routes/business.js (create, update)
  - [ ] routes/users.js (update profile, update role, query)
  - [ ] Test validation on critical endpoints
- **Integration Pattern**:
  ```javascript
  const { validateBody } = require('../middleware/validate');
  const userValidator = require('../validators/user.validator');

  router.post('/signup',
    validateBody(userValidator.signupSchema),
    asyncHandler(async (req, res) => {
      // req.body is validated and sanitized
    })
  );
  ```
- **Checklist**: See VALIDATION_INTEGRATION_TODO.md for detailed integration plan
- **Impact**: Completes input validation security layer (prevents injection attacks, ensures data integrity)
- **Source**: DEV-W2-010 (Input Validation Middleware)

### IMP-W1-001: Percentage Conversion Utility
- **Priority**: P2 (MEDIUM - Code quality)
- **Phase**: Week 2
- **Effort**: 1 hour
- **Owner**: Frontend Team
- **Description**: Create utility function for decimal-to-percentage conversion
- **Current State**: Hard-coded conversion in 3+ places (`Math.round(value * 100)`)
- **Benefit**: DRY principle, consistent formatting, easier to update
- **Tasks**:
  - [ ] Create client/js/utils/format.js
  - [ ] Add `toPercentage(decimal, decimals=0)` function
  - [ ] Replace all inline conversions with utility
  - [ ] Add unit tests
- **Source**: ISS-W1-002 (Dimension weight display bug)

### IMP-W1-002: Template Preview Before Publish
- **Priority**: P2 (MEDIUM - UX improvement)
- **Phase**: Week 2, Day 5 or Beta
- **Effort**: 4 hours
- **Owner**: Frontend Team
- **Description**: Show full question list with details before template creation
- **Current State**: Can't preview questions before clicking "Save Template"
- **Benefit**: Reduce errors, improve confidence, better UX
- **Tasks**:
  - [ ] Add "Preview" step between question selection and publish
  - [ ] Display all selected questions grouped by dimension
  - [ ] Show question count per dimension
  - [ ] Show total questions and dimension weight distribution
  - [ ] Allow going back to make changes
- **Source**: WEEK_1_SUMMARY.md nice-to-have features

### IMP-W1-003: Question Search and Filter Enhancements
- **Priority**: P2 (MEDIUM - UX improvement)
- **Phase**: Week 2 or Beta
- **Effort**: 4 hours
- **Owner**: Frontend Team
- **Description**: Enhanced question library filtering and search
- **Current State**: Only filters by dimension (Speed/Strength/Intelligence)
- **Improvements**:
  - [ ] Filter by sub-dimension (e.g., execution_velocity, resilience, data_analysis)
  - [ ] Text search by keywords in question text
  - [ ] "Recently Used" section showing last 10 selected questions
  - [ ] "Popular Questions" (most frequently used across templates)
  - [ ] Question usage count display
- **Source**: WEEK_1_SUMMARY.md medium priority issues

### IMP-W1-004: Template Analytics Dashboard
- **Priority**: P2 (MEDIUM - Data-driven improvements)
- **Phase**: Beta Q1 2026
- **Effort**: 6 hours
- **Owner**: Backend + Frontend Team
- **Description**: Track template usage and assessment performance
- **Metrics to Track**:
  - [ ] Usage count per template
  - [ ] Average SSI scores per template
  - [ ] Completion rate (started vs completed assessments)
  - [ ] Average time to complete assessment
  - [ ] Question skip rate (if allowing skips)
  - [ ] Template popularity over time
- **Benefits**: Identify best-performing templates, improve question quality
- **Tasks**:
  - [ ] Add usage tracking to Assessment model
  - [ ] Create aggregation queries for analytics
  - [ ] Build analytics dashboard UI
- **Source**: WEEK_1_SUMMARY.md low priority features

### IMP-W1-005: Template Versioning System
- **Priority**: P2 (MEDIUM - Data integrity)
- **Phase**: Beta Q1 2026
- **Effort**: 8 hours
- **Owner**: Backend Team
- **Description**: Full version control for assessment templates
- **Current State**: Template has `version` field but no version comparison/rollback
- **Features**:
  - [ ] Store template history (changes over time)
  - [ ] Compare versions side-by-side
  - [ ] Rollback to previous version
  - [ ] Track what changed (questions added/removed, weights changed)
  - [ ] Assessments link to specific template version (not just template_id)
- **Benefits**: Audit trail, ability to compare results across template versions
- **Tasks**:
  - [ ] Create AssessmentTemplateVersion model
  - [ ] Update template save to create version snapshot
  - [ ] Add version comparison endpoint
  - [ ] Build version history UI
- **Source**: WEEK_1_SUMMARY.md low priority features

### IMP-W1-006: Bulk Question Management
- **Priority**: P1 (HIGH - Operational efficiency)
- **Phase**: Week 2 or Beta
- **Effort**: 6 hours
- **Owner**: Backend + Frontend Team
- **Description**: Admin tools for question library management
- **Current State**: No bulk operations, must edit questions one by one
- **Features**:
  - [ ] CSV import for questions (bulk upload)
  - [ ] CSV export for questions (bulk download/backup)
  - [ ] Bulk edit (change dimension, sub-dimension, tags)
  - [ ] Bulk activate/deactivate questions
  - [ ] Duplicate question (with modifications)
  - [ ] Question library search and replace
- **Benefits**: Easier to populate question library, maintain consistency
- **Tasks**:
  - [ ] Create CSV import/export endpoints
  - [ ] Build admin UI for bulk operations
  - [ ] Add validation for bulk changes
  - [ ] Create question backup system
- **Source**: ISS-W1-005 (Empty question library blocks testing)

---

### IMP-012: GraphQL API Layer
- **Priority**: P3 (LOW)
- **Phase**: Future Q3 2026
- **Effort**: 2 weeks
- **Description**: GraphQL gateway on top of REST APIs
- **Status**: Nice-to-have, evaluate demand

---

## 🎨 FRONTEND IMPROVEMENTS

### IMP-013: React Migration (Critical from Reviews)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 3 weeks
- **Owner**: Frontend Lead
- **Description**: Migrate from HTML/JS prototypes to production React app
- **Current State**: Static HTML with vanilla JS (functional but not scalable)
- **Benefits**:
  - Component reusability
  - Better state management
  - Easier testing
  - Production-ready architecture
- **Tasks**:
  - [ ] Setup React + Vite build system
  - [ ] Create component library (buttons, forms, cards)
  - [ ] Migrate 15 core screens to React
  - [ ] Add React Router for navigation
  - [ ] Implement Redux/Zustand for state management
  - [ ] Add React Testing Library
  - [ ] Build process and optimization
- **Links**: From review Architecture_High_Level.md:18, Product_Strategy.md:15
- **Status**: Deferred from MVP (too risky for Nov 30 deadline)

### IMP-014: Component Library
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Shared UI component library (buttons, inputs, cards, modals)
- **Dependency**: IMP-013 (React migration)
- **Status**: After React migration

### IMP-015: State Management (Redux/Zustand)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Centralized state management for frontend
- **Dependency**: IMP-013 (React migration)
- **Status**: After React migration

### IMP-016: Design System & Storybook
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 2 weeks
- **Description**: Complete design system with Storybook for component documentation
- **Status**: Planned for Phase 2

### IMP-017: Accessibility (WCAG 2.1 AA)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Ensure platform meets accessibility standards
- **Tasks**:
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] Color contrast compliance
  - [ ] ARIA labels
  - [ ] Accessibility audit
- **Status**: Planned for Beta

### IMP-018: Mobile-Responsive Improvements
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Optimize all screens for mobile/tablet
- **Current State**: Some screens responsive, some not
- **Status**: Polish in Beta

### IMP-019: Dark Mode
- **Priority**: P3 (LOW)
- **Phase**: Phase 2 Q2 2026
- **Effort**: 1 week
- **Description**: Dark mode theme option
- **Status**: Nice-to-have

### IMP-020: Progressive Web App (PWA)
- **Priority**: P2 (MEDIUM)
- **Phase**: Phase 2 Q2 2026
- **Effort**: 1 week
- **Description**: PWA for offline capability and install prompt
- **Status**: Planned for Phase 2

---

## 🚀 FEATURE ENHANCEMENTS

### IMP-021: Email Invitation System (Completed in Week 9, but enhancements here)
- **Priority**: P2 (MEDIUM)
- **Phase**: Post-MVP (immediate)
- **Effort**: 3 days
- **Description**: Enhancements to DEV-032 email system
- **Tasks**:
  - [ ] Email templates (multiple languages)
  - [ ] Bulk invitation sending
  - [ ] Invitation scheduling
  - [ ] Custom invitation messages
  - [ ] Email open tracking
- **Links**: DEV-032 implements basic email invitations Week 9
- **Status**: Enhancements after MVP

### IMP-022: Advanced Assessment Templates (Deferred from Sprint 1)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: 5 additional assessment templates beyond default SSI
- **Templates**:
  - Balanced Scorecard
  - McKinsey 7S
  - Startup Health Check
  - Service Business Maturity
  - E-commerce Readiness
- **Links**: From review nov30_mvp_review.md:5 (remove from Sprint 1)
- **Status**: Moved to Beta

### IMP-023: Custom Template Builder (Deferred from Sprint 1)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Allow consultants to create custom assessment templates
- **Tasks**:
  - [ ] Template builder UI
  - [ ] Question library
  - [ ] Custom scoring formulas
  - [ ] Template preview
  - [ ] Template marketplace
- **Links**: From review nov30_mvp_review.md:5 (remove from Sprint 1)
- **Status**: Moved to Beta

### IMP-024: Custom Formula Editor (Deferred from Sprint 1)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Custom calculation formulas for assessments (beyond weighted average)
- **Links**: From review nov30_mvp_review.md:5 (remove from Sprint 1)
- **Status**: Moved to Beta

### IMP-025: Template Marketplace
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 2 weeks
- **Description**: Marketplace for consultants to sell templates
- **Status**: Planned for Phase 2

### IMP-026: Multi-Level Assessment System
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Individual → Team → Org SSI aggregation
- **Tasks**:
  - [ ] Employee takes individual assessment
  - [ ] Manager takes team assessment
  - [ ] Executive takes org assessment
  - [ ] Aggregate scores upward
  - [ ] Show multi-level views
- **Links**: MVP_PRD.md mentions this but not in Nov 30 scope
- **Status**: Moved to Beta

### IMP-027: OKR Quality Scoring
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: AI scores quality of OKRs (SMART criteria)
- **Status**: Planned for Beta

### IMP-028: Bulk OKR Operations
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Bulk edit, delete, assign objectives/goals
- **Status**: Planned for Beta

### IMP-029: OKR Templates Library
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Pre-built OKR templates (marketing, sales, product, etc.)
- **Current State**: Basic templates exist in planner engine
- **Enhancement**: More templates, customization
- **Status**: Enhancement in Beta

### IMP-030: Goal Dependencies
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Define dependencies between goals (Goal A blocks Goal B)
- **Status**: Planned for Phase 2

### IMP-031: Task Comments & Collaboration
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Comments on tasks, @mentions, discussions
- **Status**: Planned for Beta

### IMP-032: File Attachments (Tasks/Objectives)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Upload files to tasks and objectives
- **Status**: Planned for Phase 2

### IMP-033: Task Recurrence (Recurring Tasks)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Set tasks to repeat (daily, weekly, monthly)
- **Status**: Planned for Phase 2

### IMP-034: Time Tracking Integration
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Track time spent on tasks (integrate Clockify, Toggl, or built-in)
- **Status**: Planned for Phase 2

### IMP-035: Gantt Chart View
- **Priority**: P3 (LOW)
- **Phase**: Future Q3 2026
- **Effort**: 2 weeks
- **Description**: Timeline view for objectives and goals
- **Status**: Nice-to-have

### IMP-036: Kanban Board View
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Kanban view for task management
- **Status**: Planned for Phase 2

### IMP-037: Calendar Integration
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Sync tasks/goals with Google Calendar, Outlook
- **Status**: Planned for Phase 2

### IMP-038: Slack Integration
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Slack notifications, task creation from Slack, bot commands
- **Status**: Planned for Beta

### IMP-039: Microsoft Teams Integration
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Teams notifications, bot integration
- **Status**: Planned for Phase 2

### IMP-040: Mobile Apps (iOS/Android)
- **Priority**: P2 (MEDIUM)
- **Phase**: Phase 2 Q2-Q3 2026
- **Effort**: 3 months
- **Description**: Native or React Native mobile apps
- **Status**: Planned for Phase 2

---

## 🧠 iBRAIN FEATURES (Post-MVP)

### IMP-041: Predictive Analytics Module
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: At-risk objective detection 2 weeks in advance
- **Tasks**:
  - [ ] ML model for risk prediction
  - [ ] Risk score calculation
  - [ ] Early warning notifications
  - [ ] Corrective action suggestions
- **Status**: Beta feature (Tier 3)

### IMP-042: Sentiment Analysis & Reflection System
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Daily mood tracking, sentiment trends
- **Tasks**:
  - [ ] Daily check-in modal (emoji + text)
  - [ ] Sentiment score calculation
  - [ ] Team sentiment aggregation
  - [ ] Burnout detection
- **Links**: From review nov30_mvp_review.md:10 (hide from MVP mockups)
- **Status**: Beta feature (Tier 3)

### IMP-043: AI Coaching Assistant
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Multi-turn AI conversations for coaching
- **Tasks**:
  - [ ] Chat UI component
  - [ ] OpenAI chat integration
  - [ ] Context awareness (current objectives/goals)
  - [ ] Coaching prompt library
- **Links**: From review nov30_mvp_review.md:10 (hide from MVP mockups)
- **Status**: Beta feature (Tier 3)

### IMP-044: Workflow Automation
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 2 weeks
- **Description**: Automated task creation based on patterns
- **Status**: Beta feature (Tier 3)

### IMP-045: Custom ML Models
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 3 weeks
- **Description**: Fine-tuned models for specific business archetypes
- **Status**: Beta feature (Tier 3)

### IMP-046: Advanced Executive Dashboard
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Company health, predictive view, analytics
- **Status**: Beta feature (Tier 3)

### IMP-047: iBrain Admin Toggle UI (Beyond DEV-010 Stub)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Full admin UI for enabling/disabling iBrain modules
- **Tasks**:
  - [ ] Admin panel page
  - [ ] 6 toggle switches (predictive, sentiment, coaching, workflows, ML, dashboards)
  - [ ] Feature description tooltips
  - [ ] Real-time enable/disable
  - [ ] Usage analytics per feature
- **Links**: DEV-010 creates backend stub
- **Status**: Enhancement in Beta

---

## 📊 ANALYTICS & REPORTING

### IMP-048: Advanced Analytics Dashboard
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 2 weeks
- **Description**: Trends, patterns, insights beyond basic progress
- **Status**: Planned for Beta

### IMP-049: Custom Report Builder
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 2 weeks
- **Description**: Build custom reports (filter, group, export)
- **Status**: Planned for Phase 2

### IMP-050: Data Export (CSV, Excel, PDF)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Export all data for external analysis
- **Status**: Planned for Beta

### IMP-051: API Analytics & Usage Tracking
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Track API usage, performance metrics
- **Status**: Planned for Beta

### IMP-052: BI Tool Integration (Tableau, Power BI)
- **Priority**: P3 (LOW)
- **Phase**: Future Q3 2026
- **Effort**: 2 weeks
- **Description**: Connect Karvia data to external BI tools
- **Status**: Nice-to-have

---

## 👥 USER MANAGEMENT ENHANCEMENTS

### IMP-053: Granular Permissions (Custom Roles)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Create custom roles beyond 5 default roles
- **Status**: Planned for Phase 2

### IMP-054: Sub-Teams & Hierarchies
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Nested teams, org chart view
- **Status**: Planned for Phase 2

### IMP-055: User Activity Log (Detailed)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Detailed audit log of all user actions
- **Current State**: Observer engine tracks some activity
- **Enhancement**: More detailed, searchable logs
- **Status**: Enhancement in Beta

### IMP-056: SSO Integration (SAML, OAuth)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Single Sign-On for enterprise customers
- **Status**: Planned for Beta

### IMP-057: Two-Factor Authentication (2FA)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: 2FA for enhanced security
- **Status**: Planned for Beta

---

## 🎨 UI/UX POLISH

### IMP-058: Onboarding Tutorial
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Interactive tutorial for new users (first-time experience)
- **Status**: Planned for Beta

### IMP-059: Tooltips & Help Text
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Add helpful tooltips throughout the app
- **Status**: Planned for Beta

### IMP-060: Keyboard Shortcuts
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 3 days
- **Description**: Keyboard shortcuts for power users
- **Status**: Planned for Phase 2

### IMP-061: Search Functionality (Global)
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Global search for objectives, goals, tasks, users
- **Status**: Planned for Beta

### IMP-062: Notifications Center
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: Centralized notifications (in-app, email, push)
- **Status**: Planned for Beta

### IMP-063: Real-Time Collaboration (WebSocket)
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: See who's online, real-time updates, collaborative editing
- **Status**: Planned for Phase 2

### IMP-064: Customizable Dashboards
- **Priority**: P2 (MEDIUM)
- **Phase**: Beta Q2 2026
- **Effort**: 1 week
- **Description**: Users can customize their dashboard widgets
- **Status**: Planned for Phase 2

### IMP-065: Multi-Language Support (i18n)
- **Priority**: P2 (MEDIUM)
- **Phase**: Phase 2 Q2 2026
- **Effort**: 2 weeks
- **Description**: Support for multiple languages (Spanish, French, etc.)
- **Status**: Planned for Phase 2

---

## 🛠️ DEVOPS & OPERATIONS

### IMP-066: CI/CD Pipeline Enhancement
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 1 week
- **Description**: GitHub Actions for automated testing and deployment
- **Tasks**:
  - [ ] Automated testing on PR
  - [ ] Automated deployment to staging
  - [ ] Production deployment pipeline
  - [ ] Rollback capability
- **Status**: Planned for Beta

### IMP-067: Monitoring & Alerting
- **Priority**: P1 (HIGH)
- **Phase**: Beta Q1 2026
- **Effort**: 3 days
- **Description**: Comprehensive monitoring (Sentry, Datadog, or similar)
- **Current State**: Basic monitoring in DEV-038
- **Enhancement**: Advanced alerts, dashboards, SLO tracking
- **Status**: Enhancement in Beta

---

## 🔄 SYNC METADATA

**Last Manual Update**: 2025-10-13 08:30:00
**Auto-Sync Script**: `scripts/sync-master-lists.js`
**Sync Frequency**: On file save (git hook)

### Cross-References:
- **From MASTER_DEV_LIST**: 15 items deferred to improvements
- **To MASTER_DEV_LIST**: 0 items promoted to active dev
- **From MASTER_ISSUES_LIST**: 3 items promoted to improvements after resolution

---

**Next Review**: Weekly on Mondays (prioritize top 5 for next Beta sprint)**
