# CLAUDE.md

<!-- @GENOME T0-GOV-001 | ACTIVE | 2026-03-30 | parent:ROOT | auto:/init,/coding,/strategy,/audit,/general,/quick-fix | linked:/design,/testing -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Karvia Business** is a third-party B2B OKR (Objectives and Key Results) management platform for small-medium service businesses (50-500 employees). This is a multi-tenant SaaS application with microservices architecture.

**Current Status**: Sprint 20.5 in progress (Pre-Beta Documentation Governance, target Beta launch Apr 10, 2026)

## Ecosystem Architecture (YSELA + KARVIA + iBrain)

This codebase implements a three-layer architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│  YSELA (Product Layer) - User-facing brand                     │
│  • Behavior frameworks: BBB, GRIT, PBL                         │
│  • Coach persona, prompts, gamification                        │
│  • All user-facing copy and language                           │
└─────────────────────────────────────────────────────────────────┘
                              │ wraps
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  KARVIA (Engine Layer) - OKR backbone [THIS CODEBASE]          │
│  • Data models (Objective → KR → Goal → Task)                  │
│  • APIs, authentication, multi-tenancy                         │
│  • Microservice engines (IAM, Assessment, Planner, etc.)       │
└─────────────────────────────────────────────────────────────────┘
                              │ will connect to
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  iBrain (Intelligence Layer) - ML/AI [FUTURE]                  │
│  • Behavioral predictions, nudges, patterns                    │
│  • NOT required for Beta (standalone mode)                     │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle**: KARVIA is the reusable OKR engine. YSELA is the behavior wrapper. Users see "YSELA", KARVIA powers it invisibly.

**Key Documents**:
- [ECOSYSTEM_ARCHITECTURE.md](ECOSYSTEM_ARCHITECTURE.md) - Full three-layer explanation
- [YSELA/](YSELA/) - YSELA product layer (philosophy, experience, methodology, mockups)
- [YSELA_PHILOSOPHY.md](YSELA/philosophy/YSELA_PHILOSOPHY.md) - YSELA core philosophy
- [iBRAIN_Integration/](iBRAIN_Integration/) - Future integration specs

## Architecture

### System Design

The application uses a **microservices architecture** with a central API server orchestrating specialized engines:

```
┌─────────────────────────────────────────────────┐
│            Main Express API Server              │
│         (server/ - Port 5000)                   │
│  • Authentication & Authorization               │
│  • Multi-tenant data isolation                  │
│  • RESTful API endpoints                        │
│  • Graceful degradation with feature flags      │
└────────────┬────────────────────────────────────┘
             │
    ┌────────┴────────┬─────────────┬──────────────┐
    │                 │             │              │
┌───▼────┐   ┌───────▼──┐   ┌──────▼───┐   ┌─────▼──────┐
│  IAM   │   │Assessment│   │ Planner  │   │  Scoring   │
│ :8081  │   │  :8082   │   │  :8083   │   │   :8084    │
└────────┘   └──────────┘   └──────────┘   └────────────┘

┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Observer │   │ Tracking │   │ Insights │   │Collab.   │
│  :8085   │   │  :8086   │   │  :8087   │   │  :8088   │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

### Data Model Hierarchy

**Core OKR Cascade System** (canonical 4-level for new objectives — locked 2026-05-27 /strategy):
```
Company (Multi-tenant root)
  ├─ Objective (BO sets duration: 3-12 months, fiscal-year-aware)
  │   ├─ Key Results (3-5 measurable outcomes; inherits Objective duration window)
  │   │   ├─ Weekly Goals (1 per calendar week within KR span; new WeeklyGoal collection)
  │   │   │   └─ Daily Tasks
  │   │   │       └─ Move (FUTURE — behavior-based, AI-generated from Tasks; post-Beta)
  ├─ Teams (Departments/divisions)
  │   └─ Users (Role-based: CONSULTANT, BUSINESS_OWNER, EXECUTIVE, MANAGER, EMPLOYEE)
  └─ Assessment (Speed/Strength/Intelligence scores)
```

**Legacy cascade** (pre-Sprint-27 objectives still in production): includes Quarterly Goal layer between KR and Weekly Goal (`Goal{time_period:'QUARTERLY'}`). Preserved, not migrated. Quarterly Goal layer dropped from canonical for new objectives per user direction 2026-05-27 ("Quarterly goal does not have any impact"). Eventual full retirement post-Beta when usage measured. See [`CASCADE_MIGRATION_STATE.md`](KARVIA_STRATEGY/2-TECHNICAL/CASCADE_MIGRATION_STATE.md).

**Critical Model Files**:
- `server/models/Company.js` - Multi-tenant root with OKR generation tracking
- `server/models/Objective.js` - Supports calendar_year, fiscal_year, custom periods
- `server/models/KeyResult.js` - Separate collection (canonical) + embedded `Objective.key_results[]` (dual-write per S25 PX-3.6)
- `server/models/WeeklyGoal.js` - Canonical Weekly Goal model (4-level cascade; KR → WeeklyGoal direct)
- `server/models/Goal.js` - Legacy unified model for quarterly/weekly goals (preserved; UNION-READ with WeeklyGoal per S23 #191)
- `server/models/Task.js` - Daily Tasks (references `goal_id`; works against both legacy Goal and new WeeklyGoal `_id`)
- `server/models/User.js` - Role-based access control
- `server/models/Assessment.js` - SSI scoring system

### Key Services

**DateService** (`server/services/DateService.js`):
- Handles fiscal year calculations (April, July, October starts)
- Custom period objectives (6-36 months)
- Automatic date cascade to child goals
- Quarter boundaries and week calculations

**ValidationService** (`server/services/ValidationService.js`):
- Date validation with fiscal year support
- Goal hierarchy validation
- Period conflict detection

**Feature Flags** (`server/services/feature-flags.js`):
- Graceful degradation for optional features
- `FEATURE_OPENAI_ENABLED` - AI-powered OKR generation
- `FEATURE_REDIS_ENABLED` - Caching layer
- `FEATURE_EMAIL_ENABLED` - Email notifications
- System works with all features disabled

## Commands

### Development

```bash
# Start all services (main server + all engines + client)
npm run dev

# Start only main server
npm run dev:server

# Start individual engines
npm run dev:iam
npm run dev:assessment
npm run dev:planner

# Initial setup (install all dependencies)
npm run setup
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report

# Playwright tests (BST methodology)
npm run test:playwright
npm run test:bst           # Business Scenario Tests
npm run test:journeys      # User journey tests
npm run test:edge-cases    # Edge case validation
```

### Database

```bash
# Seed assessment questions and templates
npm run seed:assessments

# Validate seeded data
npm run validate:assessments
```

### Deployment

```bash
# Build for production
npm run build

# Docker deployment
npm run docker:build
npm run docker:up
npm run docker:down

# Production deployment (code-only sync)
./scripts/sync-production.sh
```

## Sprint-Based Development

This project follows a **structured sprint methodology** with all planning documents in `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/`.

### Current Sprint Structure

Each sprint folder contains:
- `SPRINT-X-MASTER-PLAN.md` - Complete sprint overview
- `SPRINT-X-DAILY-EXECUTION-PLAN.md` - Day-by-day breakdown
- `SPRINT-X-TECHNICAL-IMPLEMENTATION.md` - Code specifications
- `SPRINT-X-USER-STORIES.md` - User stories with acceptance criteria
- `SPRINTX_HANDOFF_DOCUMENT.md` - Progress tracking
- `SESSION_BREAK_NOTES.md` - Session restart guide (when present)

### Development Workflow

**When starting work**:
1. Check `SPRINTX_HANDOFF_DOCUMENT.md` for current progress
2. Review `SESSION_BREAK_NOTES.md` if resuming after a break
3. Read relevant epic specifications in `SPRINT-X-MASTER-PLAN.md`
4. Implement according to `SPRINT-X-TECHNICAL-IMPLEMENTATION.md`

**Important**: All Sprint-specific documentation lives in the `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-X/` folder. Never create Sprint docs in the project root.

## Critical Technical Concepts

### Multi-Tenancy

All data is isolated by `company_id`. **Always**:
- Filter queries by `req.user.company_id`
- Validate company ownership before updates
- Use tenant-aware middleware

```javascript
// Example: Correct multi-tenant query
const goals = await Goal.find({
  company_id: req.user.company_id,
  key_result_id: keyResultId
});
```

### Role-Based Access Control

**Role Hierarchy** (highest to lowest):
1. `CONSULTANT` - Full system access
2. `BUSINESS_OWNER` - Company admin
3. `EXECUTIVE` - Department oversight, objective creation
4. `MANAGER` - Team management, goal assignment
5. `EMPLOYEE` - Own tasks only

**Use `requireRole()` middleware**:
```javascript
router.post('/objectives',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'),
  async (req, res) => { ... }
);
```

### OKR Generation Control (Sprint 3 Epic 2)

**One-time generation enforcement**:
- Company model tracks `okr_generation.generated` flag
- Backend checks flag before allowing generation
- Frontend shows "Already Generated" message when true
- Prevents duplicate OKR chaos

**Implementation**:
```javascript
// Check before generation (server/routes/ai-okr.js)
if (company.okr_generation?.generated) {
  return res.status(400).json({
    error: 'OKRs already generated for this company',
    redirect: '/pages/objectives.html'
  });
}

// Frontend check (client/pages/scripts/team-ssi-view.js)
const { company } = await fetch(`/api/companies/${companyId}`);
if (company.okr_generation?.generated) {
  // Show disabled state with generation date
}
```

### Date Management System

**Flexible period types**:
- `calendar_year` - Standard Jan-Dec
- `fiscal_year` - Custom fiscal start (April, July, October)
- `custom` - 6-36 month custom periods

**Always use DateService** for date operations:
```javascript
const DateService = require('../services/DateService');

// Get quarter for fiscal year
const quarter = DateService.getQuarterForDate(date, objectiveId);

// Calculate date ranges
const { start, end } = DateService.getQuarterDates(year, quarter, objectiveId);

// Validate goal periods
await ValidationService.validateGoalDates(goalData, objective);
```

### RESTful API Design

**Goal endpoints use time_period discrimination**:
```javascript
// Quarterly goals
GET    /api/goals/quarterly/:keyResultId
POST   /api/goals/quarterly
PUT    /api/goals/quarterly/:id
DELETE /api/goals/quarterly/:id

// Weekly goals
GET    /api/goals/weekly/:quarterlyGoalId
POST   /api/goals/weekly
PUT    /api/goals/weekly/:id
DELETE /api/goals/weekly/:id
```

**All use soft deletion** (status='cancelled') not hard delete.

### Security Patterns

**XSS Prevention**: All frontend rendering must escape HTML:
```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

**JWT Authentication**: Token stored in localStorage as `karvia_token`, user data as `karvia_user`.

**Production Safety**: JWT_SECRET must not be hardcoded. Code includes fail-fast checks:
```javascript
if (process.env.NODE_ENV === 'production' &&
    config.get('security.jwt.secret') === 'fallback-secret') {
  throw new Error('FATAL: JWT_SECRET not configured in production');
}
```

## File Structure Insights

### Frontend Architecture

```
client/
├── pages/                      # HTML pages
│   ├── objectives.html             # Objectives management (manual + AI)
│   ├── planning-v2.html            # Planning page (KR-anchored weekly plan; production)
│   ├── weekly-goals.html          # Weekly goal calendar
│   ├── team-ssi-view.html         # SSI results + OKR generation
│   └── scripts/                   # Page-specific JavaScript
│       ├── planning-v2.js        # Planning page controller
│       ├── team-ssi-view.js      # Controls OKR button state
│       └── ...
└── js/
    ├── common.js              # Shared utilities
    ├── goals-api-client.js    # API client for goals
    └── navigation.js          # Unified navigation
```

### Backend Architecture

```
server/
├── models/                    # Mongoose models
├── routes/                    # Express route handlers
│   ├── goals.js              # RESTful goal endpoints (714-1447)
│   ├── objectives.js         # Objective CRUD
│   ├── ai-okr.js            # OKR generation with control
│   └── companies.js          # Company management
├── services/
│   ├── DateService.js        # Date/fiscal calculations
│   ├── ValidationService.js  # Business logic validation
│   └── feature-flags.js      # Graceful degradation
├── middleware/
│   ├── auth.js              # JWT + role-based access
│   └── errorHandler.js      # Centralized error handling
└── index.js                  # Main server entry
```

## Environment Configuration

**Required variables**:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Must be secure in production
- `NODE_ENV` - development | production

**Optional features** (graceful degradation):
- `OPENAI_API_KEY` - AI-powered features
- `REDIS_URL` - Caching layer
- `SMTP_*` - Email notifications

See `.env.example` for complete list.

## Deployment Environments (Render)

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| **Development** | `https://karvia-business-1.onrender.com` | `development` | Dev testing, feature validation |
| **Pre-prod** | `https://karvia-business-2.onrender.com` | `pre-prod` | Staging, QA testing |
| **Production** | `https://karvia-business.onrender.com` | `production` | Live customer environment |

**Deployment Flow**:
```
development → pre-prod → production
     ↓            ↓           ↓
  Feature     QA/Staging    Live
  Testing     Validation   Customers
```

**Branch to Environment Mapping**:
- Push to `development` → deploys to karvia-business-1
- Push to `pre-prod` → deploys to karvia-business-2
- Push to `production` → deploys to karvia-business (CAREFUL!)

## Testing Strategy

**BST (Business Scenario Testing)** methodology:
- `test:bst` - Core business scenarios
- `test:journeys` - End-to-end user journeys
- `test:edge-cases` - Boundary conditions

**Test files locations**:
- Unit tests: `tests/unit/`
- Integration: `tests/integration/`
- E2E: `tests/e2e/`
- Playwright: `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/`

## Common Patterns

### API Response Format
```javascript
// Success
res.json({
  success: true,
  data: result,
  message: 'Optional success message'
});

// Error
res.status(400).json({
  success: false,
  error: 'Error message',
  message: 'User-friendly message'
});
```

### Population Pattern
```javascript
const goal = await Goal.findById(id)
  .populate('owner_id', 'name email role')
  .populate('objective_id', 'title category')
  .populate('assigned_to.user_id', 'name email');
```

### Authentication Flow
```javascript
const token = localStorage.getItem('karvia_token');
const response = await fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Known Constraints

1. **No enum changes without migration** - Models use enums; changing requires data migration
2. **Fiscal years limited** - Only April, July, October starts supported (not all months)
3. **Goal cascade is one-way** - Parent changes cascade down, not up
4. **Soft delete only** - Never hard delete goals/objectives (use status='cancelled')
5. **Company isolation is mandatory** - All queries must filter by company_id

## Git Workflow

**Branch**: Currently on `development` branch

**Commit format**:
```bash
git commit -m "feat(sprint20.5): Description

- Detailed changes
- Reference to epic/issue

Epic X (Name) - Y story points
Sprint [N] Progress: X/[total] points (Y%)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Session Management & Performance

**Every Claude session should follow a structured approach**. See comprehensive guides:

- **[CLAUDE_STRATEGY.md](./CLAUDE_STRATEGY.md)** - Overall strategy for maximizing Claude effectiveness
- **[.claude/Claude_Performance_Key_Metrics.md](./.claude/Claude_Performance_Key_Metrics.md)** - Metrics framework for all session types
- **[.claude/QUICK_START_GUIDE.md](./.claude/QUICK_START_GUIDE.md)** - Fast reference for starting sessions
- **[.claude/SESSION_LOG.md](./.claude/SESSION_LOG.md)** - Session history and progress tracking

### Session Types

Classify every interaction into one of five types:

1. **Strategy Session** - Sprint planning, architecture, specifications (20-30% tokens)
2. **Coding Session** - Feature implementation, bug fixes (40-60% tokens)
3. **Audit Session** - Code review, quality validation (25-35% tokens)
4. **Testing Session** - BST execution, bug detection (20-30% tokens)
5. **General Session** - Research, questions, quick fixes (10-20% tokens)

Each session type has specific metrics, success criteria, and deliverables. Always identify the session type before starting.

### Before Every Session

1. Read `.claude/SESSION_LOG.md` - What's been done
2. Read `SPRINT3_HANDOFF_DOCUMENT.md` - Current progress
3. Read `SESSION_BREAK_NOTES.md` (if exists) - Restart point
4. Identify session type and set objectives
5. Review relevant sprint documentation

### Quality Gates (Coding Sessions)

Every coding session output must pass:
- ✅ Security: XSS prevention, multi-tenant isolation, RBAC
- ✅ Architecture: RESTful, error handling, graceful degradation
- ✅ Documentation: Handoff updated, session break notes created
- ✅ Testing: Critical paths validated

Target: ≥8/10 quality rating per session.

## Document Governance

This section defines how documentation is managed across the Karvia codebase.

### Genome Tags

Every governed document has a one-line genome tag within the first 10 lines:

```markdown
<!-- @GENOME [ID] | [STATUS] | [UPDATED] | parent:[PARENT] | auto:[COMMANDS] | linked:[COMMANDS] -->
```

**Example**:
```markdown
<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding,/strategy | linked:/design -->
```

**Fields**:

| Field | Format | Purpose | Example |
|-------|--------|---------|---------|
| ID | `T[0-3]-[DOM]-[SEQ]` | Unique identifier | `T2-ARC-001` |
| Status | `ACTIVE\|DRAFT\|ARCHIVED` | Lifecycle state | `ACTIVE` |
| Updated | `YYYY-MM-DD` | Last modified | `2026-03-30` |
| Parent | `parent:[ID\|ROOT]` | Hierarchy | `parent:T0-GOV-001` |
| Auto | `auto:[commands]` | Commands that auto-load | `auto:/coding,/strategy` |
| Linked | `linked:[commands]` | Commands that reference | `linked:/design` |

### Tier Definitions

| Tier | Name | Change Authority | Examples |
|------|------|------------------|----------|
| T0 | Constitutional | Requires approval | CLAUDE.md, SESSION_LOG |
| T1 | Strategic | Product owner | PRODUCT_VISION, ROADMAP |
| T2 | Canonical | Technical lead | CONTEXT_REGISTRY, DESIGN_SYSTEM |
| T3 | Working | Any contributor | Sprint docs, handoffs |

### Domain Codes

| Code | Domain | Typical Tier | Description |
|------|--------|--------------|-------------|
| GOV | Governance | T0, T2 | Rules, standards, policies |
| PRD | Product | T1, T2 | Product strategy, specs |
| ARC | Architecture | T2 | Technical architecture |
| SPR | Sprint | T3 | Sprint plans, handoffs |
| TST | Testing | T2, T3 | Test plans, QA docs |
| OPS | Operations | T2 | Deployment, infrastructure |
| DES | Design | T2, T3 | Mockups, UI/UX specs |
| CMD | Commands | T2 | Slash commands |
| SES | Session | T0, T3 | Session logs, break notes |
| NAV | Navigation | T0, T1, T2, T3 | README files - folder indexes for humans |

### Governed Directories

Only these directories are genome-tracked:

| Directory | Contents | Tracking |
|-----------|----------|----------|
| `.claude/` | Session management, commands | REQUIRED |
| `KARVIA_STRATEGY/1-PRODUCT/` | Product strategy | REQUIRED |
| `KARVIA_STRATEGY/2-TECHNICAL/` | Architecture docs | REQUIRED |
| `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-*/` | Active sprints | REQUIRED |
| `KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/` | Deployment docs | REQUIRED |

**Excluded** (not tracked - no orphan warnings):
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*Complete*/` - Archived sprints
- `Karvia_OKR_Product_Planning/` - Legacy (pending migration)
- `node_modules/`, `.git/` - System directories

### Command Aliases

| Command | Aliases |
|---------|---------|
| `/strategy` | `/sprint-planning`, `/plan` |
| `/general` | `/debug`, `/research` |
| `/quick-fix` | `/hotfix` |
| `/sprint-review` | `/retro` |

### Token Budgets

| Level | Soft Limit | Hard Limit | Action if Exceeded |
|-------|------------|------------|-------------------|
| AUTO | 3,000 | 5,000 | Move lowest-priority to LINKED |
| AUTO + LINKED | 6,000 | 10,000 | Suggest /general instead |

### Computed Registry

Instead of maintaining a registry file, compute on demand:

```bash
# Generate full registry
grep -r "@GENOME" --include="*.md" .claude/ KARVIA_STRATEGY/

# Find children of a document
grep -r "parent:T0-GOV-001" --include="*.md"

# Find docs for a command
grep -r "auto:.*coding" --include="*.md"

# Find stale docs
grep -r "@GENOME.*2025-" --include="*.md"
```

## Key Documentation Files

**Session Management** (Read these first):
1. `.claude/SESSION_LOG.md` - Session history and sprint progress
2. `.claude/CONTEXT_REGISTRY.md` - What to reference before creating files
3. Current sprint handoff - Found via `/init` command

**Current Sprint** (Reference during sessions):
1. `*_HANDOFF_DOCUMENT.md` - Current progress and restart instructions
2. `SESSION_BREAK_NOTES.md` - Restart guide (if present)
3. `*_MASTER_PLAN.md` - Epic specifications
4. Technical implementation docs - Code specs

**Find Current Sprint**:
```bash
ls -d KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*"In Progress"* 2>/dev/null || \
ls -d KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-2* 2>/dev/null | tail -1
```

**Project Context**:
- `README.md` - Project overview and quick start
- `KARVIA_STRATEGY/1-PRODUCT/roadmap/` - Product roadmap and vision

## Building Principles

Locked during Sprint 30 /strategy synthesis 2026-06-01. These five principles govern every change to the Karvia codebase — features, documentation, memory, process. Applied recursively.

1. **Incremental Innovation** — Find the smallest amendment to existing plan. Resist redesigns. When new context lands, default to extending what's there, not starting over.

2. **Reuse-Max** — Exhaust existing fields, services, components, and surfaces before adding new. Before proposing a new field/service/abstraction, grep for the existing equivalent and reuse it. Only add new when no existing surface fits.

3. **Less Tech Debt** — Every new surface must be additive-only or carry an explicit cleanup path. No half-finished implementations. No backwards-compatibility hacks for unused code.

4. **Scalable** — Solutions must work at 5 consultants and 5000 consultants without re-architecture. Designs that break under scale don't ship.

5. **State Parsimony** — Prefer derivation over storage; prefer inference over flags; prefer rendering from canonical events over caching derived state. Every new field or stored value must justify its persistence cost. *The less memory we hold while providing the same value at each touchpoint, the more agility the dev factory gets.*

## The Circular Economy

Karvia is a circular economy of effort. Every consultant act seeds a deck of cards (Add Client → BO accepts → assessment → wizard → objective → KR → weekly goal → task → done → aggregate). Each completed task pays down the "interest" on the next nudge because the cohort learns the pattern.

A healthy circulation is one where:
- nudge cost trends ↓ (less email + cron + consultant outreach per completion)
- completion velocity trends ↑ (more cards flipping to done per unit time)
- the cohort's voice (Weekly Pulse + Feature ratings) confirms the behavioral trend

**Canonical adoption metric**: `Σ tasks_completed ÷ Σ nudges_sent`, trended over time, computed per-client / per-consultant / per-platform. KARVIA emits both terms today — numerator from `Task.status='completed'`, denominator from the `reminders_sent` family on `Objective` / `WeeklyGoal` / `Task` (shipped in S27 F.2-F.4). iBrain enriches with ML predictions post-Beta.

**The engine is recursive — a game within a game.** Client tenants run business OKRs; consultant tenants run meta-OKRs about clients; manager teams in either tenant run sub-OKRs. Same models, same routes, same UI. The engine doesn't know one tenant from another. The only thing that crosses tenant boundaries is a consultant's read-lens on `User.managed_businesses[]` — a pure derivation query.

**The Feedback page (`pages/feedback.html`) is the metronome surface.** A periodic reflection cron pulls every player back to one URL to reflect on their OKRs and their Tasks. Only the consultant has an outbound action there — Add Client — which seeds the next deck. Everyone else's reflection IS the signal they leave behind for the consultant to read.
