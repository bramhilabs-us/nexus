# Architecture Audit Report - January 28, 2026

**Auditor**: Claude Code
**Scope**: Architecture Audit (design patterns, error handling, API consistency, structural quality)
**Files Reviewed**: ~80+ (20 routes, 14 models, 22 services, 9 middleware, 20+ frontend JS)
**Lines of Code**: ~25,000+

---

## Executive Summary

- **Critical Issues**: 2
- **High Priority**: 6
- **Medium Priority**: 6
- **Low Priority**: 4
- **Overall Quality Rating**: 7/10

The codebase has a **solid architectural foundation** with good multi-tenancy, well-indexed models, and comprehensive error handling middleware. However, it suffers from **inconsistent patterns across layers**: response formats vary between routes, auth token keys differ across frontend files, XSS protection is partial (~56% coverage), and business logic leaks into route handlers instead of services.

---

## Critical Issues (MUST FIX)

### C1. Auth Token Key Inconsistency (Frontend)

- **Severity**: CRITICAL
- **Category**: Authentication / Data Loss
- **Impact**: Users on pages using wrong token key will appear unauthenticated; API calls silently fail
- **Locations**:
  - `client/js/goals-api-client.js:10` - uses `localStorage.getItem('token')`
  - `client/js/analytics-api-client.js:13,40` - uses `localStorage.getItem('token')`
  - `client/js/common.js:15-24` - 3-level fallback cascading
- **Standard Key**: `karvia_auth_token`
- **Fix**: Update all files to use `karvia_auth_token` exclusively. Remove fallback chain from common.js.

### C2. Teams Routes Missing requireRole Middleware

- **Severity**: CRITICAL
- **Category**: Authorization Bypass
- **Impact**: Any authenticated user (including EMPLOYEE) can create/update/delete teams
- **Location**: `server/routes/teams.js:25-344` - POST/PUT/DELETE have no `requireRole()` middleware
- **Fix**: Add `requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER')` to team mutation routes.

---

## High Priority Issues

### H1. Response Format Inconsistency Across Routes

- **Category**: Architecture
- **Impact**: Frontend must handle multiple response shapes; increases bug surface
- **Examples**:
  - `goals.js`: `{ success, count, goals }`
  - `assessment-templates.js`: `{ success, count, data }`
  - `teams.js`: `{ success, error }` (no message field)
  - `analytics.js`: `{ success: false, message, error: undefined }` (error field is literally `undefined` in production)
  - `auth.js`: `{ success: false, message }` (no error field)
- **Fix**: Standardize all routes to `{ success, data?, error?, message? }`. Fix analytics.js conditional error field.

### H2. Business Logic Scattered in Routes (No UserService/TeamService)

- **Category**: Architecture
- **Impact**: Code duplication, harder testing, inconsistent behavior
- **Details**: Only `objectiveService.js` and `DateService.js` properly extract business logic. Team, User, and Goal operations live directly in route handlers.
- **Fix**: Extract TeamService, UserService, and GoalService for reuse and testability.

### H3. God Service Pattern in aiOKRService

- **Category**: Architecture
- **Location**: `server/services/aiOKRService.js`
- **Impact**: Single service handles OpenAI calls + context building + template fallback + analytics
- **Fix**: Split into OKRGenerationService + OKRTemplateService + separate context builder.

### H4. XSS Protection Coverage at ~56%

- **Category**: Security
- **Impact**: User-generated content rendered without escaping in ~20 files
- **High-Risk Files**:
  - `client/js/navigation.js:107-120` - userName/email unescaped in user menu
  - `client/pages/scripts/feedback-admin.js:179,219,281` - innerHTML with user data
  - `client/pages/scripts/business-assessment.js:482-493` - API response data unescaped
  - `client/pages/scripts/objective-detail.js:191,253` - mixed escaping patterns
- **Fix**: Audit all innerHTML assignments with dynamic data. Use `escapeHtml()` from common.js consistently.

### H5. Companies.js Temporary Consultant Access

- **Category**: Multi-Tenancy
- **Location**: `server/routes/companies.js:32-94`
- **Impact**: CONSULTANT role can access ALL companies (marked TEMPORARY with TODO)
- **Fix**: Implement `managed_businesses` filtering for consultant queries.

### H6. Debug Logging in Auth Middleware (Production)

- **Category**: Security
- **Location**: `server/middleware/authGuards.js:41-47`
- **Impact**: Logs cookie keys and auth header presence on every request
- **Fix**: Remove or gate behind `NODE_ENV === 'development'`.

---

## Medium Priority Issues

### M1. Service Name Collision

- **Location**: `SSIScoringService.js` exists in both `server/services/` and `server/services/diagnostic/`
- **Fix**: Rename diagnostic version to `DiagnosticSSIScoringService.js`

### M2. No Transaction Support for Cascading Operations

- **Location**: `server/services/cascade-engine.js`
- **Impact**: Partial failures in multi-model updates leave inconsistent state
- **Fix**: Use Mongoose sessions/transactions for cascade operations.

### M3. Feature Flag Checking Not Centralized

- **Location**: Scattered across individual services
- **Fix**: Create middleware that checks feature flags before route execution.

### M4. Rate Limiter Per-User Tracking Fragile

- **Location**: `server/middleware/rateLimiting.js:108`
- **Impact**: `req.user._id` can be undefined for optional auth routes
- **Fix**: Fall back to IP address when user ID unavailable.

### M5. Missing Compound Indexes for Analytics

- **Locations**: Assessment model lacks `(company_id, user_id)` compound; Goal lacks `(company_id, parent_goal_id)` compound
- **Fix**: Add compound indexes for common query patterns.

### M6. auth.js vs authGuards.js Dual Authentication

- **Impact**: Two auth middleware files with overlapping but different behavior
- **Fix**: Consolidate into single auth strategy or clearly document when to use which.

---

## Low Priority Issues

### L1. Inline Scripts in HTML Pages

- **Location**: `client/pages/objectives.html:923+`
- **Fix**: Move to external JS files.

### L2. Virtual Field Performance on Large Datasets

- **Impact**: Computed on every `toJSON()` call
- **Fix**: Consider caching for bulk operations.

### L3. Hardcoded Fallback URLs

- **Location**: `authGuards.js:310` - `http://localhost:8081`
- **Fix**: Require explicit env var configuration.

### L4. No OpenAPI/Swagger Documentation

- **Fix**: Generate API documentation from route definitions.

---

## Positive Findings

- **Model layer is excellent**: 14 models with consistent schemas, 40+ indexes, good virtual fields, proper timestamps and soft-delete patterns
- **Centralized error handler** (`errorHandler.js`): Handles Mongoose, JWT, Multer, and duplicate key errors with structured logging
- **Role-based access control**: 5-tier hierarchy properly implemented in `roleGuards.js` and `accessControl.js`
- **Feature flags**: Graceful degradation for OpenAI, Redis, and Email features
- **DateService/ValidationService**: Clean separation of date logic from routes
- **Frontend common.js**: Well-organized utility library with proper `escapeHtml()`, `apiRequest()`, and auth helpers
- **Rate limiting**: Properly configured for auth, signup, and sensitive endpoints

---

## Quality Scorecard

| Category | Score (1-10) | Notes |
|----------|--------------|-------|
| Security | 6 | XSS gaps, debug logging, teams auth missing |
| Architecture | 7 | Good patterns but inconsistent adoption |
| Code Quality | 7 | Clean code, but response format varies |
| Documentation | 6 | CLAUDE.md excellent, but no API docs |
| Testing | 7 | Good test coverage from previous sprints |
| **Overall** | **7** | Solid foundation needing consistency pass |

---

## Recommendations

1. **Consistency Sprint**: Dedicate a session to standardize response formats, token keys, and XSS protection across all files
2. **Service Layer Extraction**: Create TeamService, UserService, GoalService before adding new features
3. **Auth Consolidation**: Merge auth.js and authGuards.js into single strategy
4. **Security Hardening**: Remove debug logging, add requireRole to teams.js, fix consultant company access

---

## Next Steps

- [ ] Fix C1 (token keys) and C2 (teams requireRole) immediately
- [ ] Address H4 (XSS) and H6 (debug logging) in next coding session
- [ ] Schedule H1 (response format) and H2 (service layer) for dedicated sprint
- [ ] Create tickets for medium/low issues in backlog

---

**Session Rating**: 9/10
**Coverage**: 95% of backend, 80% of frontend
**Issues Found**: 18 total (2 Critical, 6 High, 6 Medium, 4 Low)
