# Context Registry: What to Reference Before Creating

<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-04-05 | parent:T0-GOV-001 | auto:/coding,/strategy | linked:/init,/design -->

**Version**: 2.1.0
**Last Updated**: April 5, 2026
**Purpose**: Define required reading before creating any document or code
**Usage**: Check this file BEFORE creating anything

---

## Quick Lookup Table

| Creating | Primary Reference | Secondary References |
|----------|-------------------|---------------------|
| API endpoint | CLAUDE.md, existing routes/*.js | models/, ValidationService |
| Database model | existing models/*.js | DateService, CLAUDE.md §Data Model |
| Goal/Task logic | Goal.js, DateService | ValidationService, Objective.js |
| Frontend page | common.js, navigation.js | goals-api-client.js, existing pages/ |
| Frontend script | existing scripts/*.js | common.js, API patterns |
| Sprint plan | DOC_STANDARDS.md | Previous sprint, SESSION_LOG.md |
| Epic definition | Previous epics | Sprint master plan |
| Test file | existing tests/ | ValidationService, models/ |
| Email template | mailjetService.js | EMAIL-DESIGN-SYSTEM.md |
| AI/LLM feature | AIContextService.js | ai-okr.js, Company model |

---

## 1. Backend Code Creation

### 1.1 API Endpoint (routes/*.js)

```
MUST READ (before writing any route):
├── CLAUDE.md
│   └── §RESTful API Design (response format, soft delete)
│   └── §Multi-Tenancy (company_id filtering)
│   └── §Role-Based Access Control (requireRole middleware)
├── server/middleware/auth.js
│   └── authenticateToken, requireRole patterns
├── Existing route in same domain
│   └── e.g., routes/goals.js for goal-related endpoints
└── Related model
    └── e.g., models/Goal.js for goal endpoints

SHOULD SKIM:
├── server/services/ValidationService.js
├── server/services/DateService.js (if date-related)
└── server/middleware/errorHandler.js

PATTERNS TO FOLLOW:
- Always filter by req.user.company_id
- Use soft delete (status='cancelled')
- Return { success: true, data: result }
- Use try/catch with next(error)
```

### 1.2 Database Model (models/*.js)

```
MUST READ:
├── CLAUDE.md
│   └── §Data Model Hierarchy
│   └── §Known Constraints (enums, soft delete)
├── Existing related models
│   └── e.g., Objective.js if creating Goal-related model
├── server/models/Company.js
│   └── Multi-tenant root reference
└── DateService.js (if date fields involved)

SHOULD SKIM:
├── ValidationService.js (validation patterns)
└── Existing model with similar structure

CRITICAL RULES:
- Include company_id for multi-tenancy
- Use timestamps: true
- Soft delete via status field, not hard delete
- No enum changes without migration planning
```

### 1.3 Service (services/*.js)

```
MUST READ:
├── CLAUDE.md
│   └── §Key Services section
├── Existing services in same domain
│   └── e.g., DateService.js, ValidationService.js
└── Models the service operates on

SHOULD SKIM:
├── feature-flags.js (graceful degradation)
└── Related routes that will use this service
```

### 1.4 AI/LLM Feature

```
MUST READ:
├── server/services/AIContextService.js (2059 lines)
│   └── buildContext(), getFullSSIScores()
├── server/routes/ai-okr.js
│   └── OKR generation patterns
├── server/models/Company.js
│   └── business_context, strategic_vision fields
│   └── llm_context tracking
└── CLAUDE.md §OKR Generation Control

SHOULD SKIM:
├── Assessment model (SSI scores)
└── Objective model (existing objectives)

CRITICAL RULES:
- Use AIContextService.buildContext() not manual context
- Include token budget in context
- Log LLM interactions to Company.llm_context
- Check company.okr_generation.generated flag
```

---

## 2. Frontend Code Creation

### 2.1 New Page (pages/*.html)

```
MUST READ:
├── client/pages/dashboard-v2.html (latest layout)
│   └── S13 layout pattern
├── client/js/common.js
│   └── Utilities, escapeHtml, token handling
├── client/js/navigation.js
│   └── Unified navigation component
└── Existing page with similar structure

SHOULD SKIM:
├── client/css/main.css
├── DESIGN_SYSTEM.md (Navy/Gold tokens)
└── Related API endpoints

PATTERNS TO FOLLOW:
- Use karvia_token for auth
- Include navigation.js
- Use escapeHtml() for all user content (XSS prevention)
- Follow S13 layout: sidebar + main content
```

### 2.2 Page Script (scripts/*.js)

```
MUST READ:
├── client/js/common.js
│   └── Shared utilities
├── client/js/goals-api-client.js
│   └── API client patterns
├── Existing script for similar page
│   └── e.g., team-ssi-view.js for SSI pages
└── Related routes/*.js (API contract)

SHOULD SKIM:
├── navigation.js
└── Related page HTML structure

PATTERNS TO FOLLOW:
- const token = localStorage.getItem('karvia_token')
- fetch with Authorization: Bearer ${token}
- Error handling with user-friendly messages
- Loading states for async operations
```

### 2.2.1 Frontend Role-Check Rule (Sprint 22a Phase 3.3, F-L-03)

**Rule**: Frontend `if (role === 'CONSULTANT')` checks (and equivalents for any
other role) are allowed for **rendering only** — never for **business rules**.

| Allowed (rendering) | Forbidden (business rule) |
|---|---|
| Hide / show a column or button | Decide whether a write succeeds |
| Pick which redirect after login | Authorize a fetch / mutation |
| Choose a copy variant | Filter sensitive data client-side |
| Inject role-specific nav items | Skip a server validation |

**Why**: All authorization MUST live in the Middleware layer (`requireRole`,
`requireManagedClient`, RBAC guards). The frontend is the *experience layer*
per the 4-layer Lego model — it asks "what should I show?", not "what is the
user allowed to do?".

The audit (F-L-03) catalogued 19 existing role-check sites; all are rendering
today. This rule prevents drift.

**Pre-merge check** (run before any PR that touches `client/`):

```bash
# Lints any frontend role-check that gates a fetch / mutation / navigation
# decision rather than a render. The list of currently-blessed sites is in
# scripts/test-phase3-3-frontend-role-checks.js. New role checks must either:
#   (a) be added to the blessed list (rendering) with a comment explaining why
#   (b) be replaced with a server-side check
node scripts/test-phase3-3-frontend-role-checks.js
```

**Reviewer prompt**: For every `if (role === ...)` added or modified in a PR,
ask: *"What happens if a malicious user flips this in DevTools?"* If the
answer is "they get to do something they shouldn't" → it's a business rule
and must move to the server.

### 2.3 Email Template

```
MUST READ:
├── server/services/mailjetService.js
│   └── Existing email methods
├── KARVIA_STRATEGY/.../EMAIL-DESIGN-SYSTEM.md
│   └── Template design patterns
└── Existing email templates in mailjetService

PATTERNS TO FOLLOW:
- Minimalist design (Navy/Gold palette)
- Single CTA button
- Mobile-responsive tables
- Unsubscribe link where applicable
```

---

## 3. Documentation Creation

### 3.1 Sprint Plan

```
MUST READ:
├── KARVIA_STRATEGY/GUIDES/documentation-standards/DOC_STANDARDS.md
│   └── K0-K4 tier system, Doc IDs
├── Previous sprint's master plan
│   └── Format, epic structure
├── .claude/SESSION_LOG.md
│   └── Recent progress, blockers
└── Current sprint's handoff document

SHOULD SKIM:
├── ROADMAP_OVERVIEW.md
└── Previous sprint's test report

SAVE TO: KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-XX/
```

### 3.2 Epic Definition

```
MUST READ:
├── Sprint master plan
│   └── Epic overview and story points
├── Previous epic definitions in same sprint
│   └── Format consistency
├── DOC_STANDARDS.md
│   └── Doc ID format (K3-EPIC-XXX)
└── Related technical docs

SHOULD SKIM:
├── User stories if available
└── Related code files

SAVE TO: Same folder as sprint plan
```

### 3.3 Test Plan

```
MUST READ:
├── Feature/epic being tested
├── Existing test plans
│   └── KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/
├── TESTING_STANDARDS.md
└── Related routes and models

SHOULD SKIM:
├── Previous sprint test reports
└── AUDIT_TRACKER.md for known issues

SAVE TO: KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/2-TEST-PLANS/
```

---

## 4. Domain-Specific References

### 4.0 Vision Documents (T1 Strategic)

| Topic | Reference |
|-------|-----------|
| KARVIA engine vision | KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md |
| YSELA product vision | KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md |
| Product roadmap | KARVIA_STRATEGY/1-VISION/PRODUCT_ROADMAP.md |
| Detailed YSELA vision | YSELA/vision/YSELA_VISION.md |
| Three-layer ecosystem | ECOSYSTEM_ARCHITECTURE.md |
| KARVIA 1.0 capabilities | KARVIA_STRATEGY/1-PRODUCT/KARVIA_1.0_CAPABILITIES.md |

### 4.1 OKR Domain

| Topic | Reference |
|-------|-----------|
| Objective model | server/models/Objective.js |
| Key Result model | server/models/KeyResult.js |
| Goal model | server/models/Goal.js |
| OKR generation | server/routes/ai-okr.js |
| Date calculations | server/services/DateService.js |
| Validation | server/services/ValidationService.js |
| Generation control | Company.okr_generation flag |

### 4.2 Assessment/SSI Domain

| Topic | Reference |
|-------|-----------|
| Assessment model | server/models/Assessment.js |
| SSI scoring | AIContextService.getFullSSIScores() |
| 12-block scoring | AIContextService.js §MECE blocks |
| Diagnostic flow | server/services/diagnostic/ |
| Assessment routes | server/routes/assessments.js |

### 4.3 User/Auth Domain

| Topic | Reference |
|-------|-----------|
| User model | server/models/User.js |
| Role hierarchy | CLAUDE.md §Role-Based Access Control |
| Auth middleware | server/middleware/auth.js |
| JWT handling | CLAUDE.md §Security Patterns |
| Multi-tenancy | company_id filtering |

### 4.4 Team/Invitation Domain

| Topic | Reference |
|-------|-----------|
| Team model | server/models/Team.js |
| Invitation model | server/models/Invitation.js |
| Team routes | server/routes/teams.js |
| Invitation routes | server/routes/invitations.js |
| Email service | server/services/mailjetService.js |

---

## 5. Path Quick Reference

### Backend Paths

```
Models:        server/models/
Routes:        server/routes/
Services:      server/services/
Middleware:    server/middleware/
Config:        server/config/
Seeds:         server/seeds/
Validators:    server/validators/
```

### Frontend Paths

```
Pages:         client/pages/
Scripts:       client/pages/scripts/
Shared JS:     client/js/
CSS:           client/css/
```

### Documentation Paths

```
Strategy:      KARVIA_STRATEGY/
Sprints:       KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/
QA:            KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/
Product:       KARVIA_STRATEGY/1-PRODUCT/
Technical:     KARVIA_STRATEGY/2-TECHNICAL/
Guides:        KARVIA_STRATEGY/GUIDES/
```

### Session Paths

```
Session Log:   .claude/SESSION_LOG.md
Commands:      .claude/commands/
Templates:     .claude/templates/
```

---

## 6. Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Create model without company_id | Always include company_id for multi-tenancy |
| Hard delete records | Use soft delete (status='cancelled') |
| Skip escapeHtml() on user content | Always escape to prevent XSS |
| Guess API response format | Check existing routes for pattern |
| Create redundant service | Check if functionality exists |
| Modify T0/T1 enums without migration | Plan migration or use new field |
| Skip req.user.company_id filter | Always filter by company_id |

---

## 7. Checklist Before Creating

### For Code Files

```
[ ] Read CLAUDE.md relevant section
[ ] Check existing files in same domain
[ ] Understand multi-tenant implications
[ ] Know the API response format
[ ] Plan for error handling
```

### For Documentation

```
[ ] Read DOC_STANDARDS.md for format
[ ] Check tier (K0/K1/K2/K3/K4)
[ ] Assign Doc ID if K0-K3
[ ] Include metadata header
[ ] Link to parent/related docs
```

---

## 8. Session-Document Matrix

**Legend**: A = AUTO (loaded at session start), L = LINKED (path provided, read if needed), - = Not loaded

| Document | ID | /init | /close | /strategy | /coding | /design | /audit | /testing | /release | /deploy | /quick-fix | /general | /review |
|----------|-----|:-----:|:------:|:---------:|:-------:|:-------:|:------:|:--------:|:--------:|:-------:|:----------:|:--------:|:-------:|
| CLAUDE.md | T0-GOV-001 | A | - | A | A | - | A | - | - | - | A | A | - |
| SESSION_LOG.md | T0-SES-001 | A | A | - | - | - | - | - | - | - | - | - | A |
| CONTEXT_REGISTRY.md | T2-ARC-001 | L | - | A | A | - | - | - | - | - | - | - | - |
| DESIGN_SYSTEM.md | T2-DES-001 | - | - | - | - | A | - | - | - | - | - | - | - |
| Current sprint handoff | T3-SPR-xxx | A | L | A | A | - | - | A | A | A | A | - | A |
| DEPLOYMENT_GUIDE.md | T2-OPS-003 | - | - | - | - | - | - | - | A | A | L | - | - |
| HOTFIX_PLAYBOOK.md | T2-OPS-005 | - | - | - | - | - | - | - | - | L | A | - | - |
| Technical spec | T3-SPR-xxx | - | - | L | A | - | - | L | - | - | - | - | - |
| Test plan | T3-TST-xxx | - | - | - | - | - | - | A | L | - | - | - | - |
| AUDIT_TRACKER.md | T2-GOV-003 | - | - | - | - | - | A | - | - | - | - | - | - |

### Token Budget Summary

| Command | AUTO Tokens | Status |
|---------|-------------|--------|
| /init | ~1,200 | OK |
| /close | ~200 | OK |
| /strategy | ~2,500 | OK |
| /coding | ~1,800 | OK |
| /design | ~1,700 | OK |
| /audit | ~900 | OK |
| /testing | ~1,200 | OK |
| /release-audit | ~1,400 | OK |
| /deploy | ~1,200 | OK |
| /quick-fix | ~800 | OK |
| /general | ~300 | OK |
| /sprint-review | ~1,200 | OK |

**Soft limit**: 3,000 tokens | **Hard limit**: 5,000 tokens

### Bidirectional Sync

Matrix is **source of truth**. Commands embed their lists derived from this matrix.

**Validation**:
```bash
# Verify doc says it's AUTO for /coding
grep "auto:.*coding" --include="*.md" .claude/ KARVIA_STRATEGY/

# Compare with this matrix row where /coding = A
```

If mismatch detected, update both the doc's genome tag AND this matrix.

---

**Document Status**: Active - Reference BEFORE creating any file
**Usage**: Check this registry before every file creation
