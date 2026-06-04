# Session #167: Integration & Sprint 22 Master Planning

<!-- @GENOME T3-SPR-022-S4 | ACTIVE | 2026-04-20 | parent:T3-SPR-022 | auto:/sprint-planning,/strategy | linked:/coding -->

**Session Goal**: Synthesize all strategies via user journey brainstorming, then create Sprint 22 Master Plan
**Duration**: 2-3 sessions (brainstorm + documentation)
**Status**: ⚠️ In Progress - Brainstorm 7/13 topics complete
**Prerequisites**: Sessions #164-166 complete, all strategy docs finalized

---

## Session Objectives

### Primary Goal
Transform strategic documents into an executable Sprint 22 plan with clear epics, technical specs, and 6-week roadmap.

### Deliverables
1. ✅ INTEGRATION_STRATEGY.md (how all pieces connect)
2. ✅ Sprint 22 Master Plan (epics, stories, points)
3. ✅ Architecture Decision Records (ADRs)
4. ✅ Technical Implementation Specifications
5. ✅ 6-Week Execution Roadmap
6. ✅ Acceptance Criteria & Definition of Done

---

## Brainstorming Progress (Session #167 Part 1)

### Topics Completed (7/13)

| Topic | Status | Key Decisions |
|-------|--------|---------------|
| **Add Client Wizard** | ✅ Complete | 2-step wizard, AI auto-fill from company name, progressive reveal |
| **My Clients Cards** | ✅ Complete | Profile % only when incomplete, invite button on card, template status |
| **Industry/Sector** | ✅ Complete | 4 sectors, 12 industries in dropdown |
| **Objective Creation** | ✅ Complete | 3-screen wizard, SSI target + behaviors, AI KR generation |
| **Objectives Page** | ✅ Complete | Minimal header, expandable summary bar (collapsed default) |
| **Quarterly Goals** | ✅ Complete | 1:4 KR mapping, simple modal (title+target), 4 weeks/quarter |
| **Dual User Context** | ✅ Complete | Same UI for consultant and business owner ("View As" pattern) |

### Key Design Decisions Made

```
ADD CLIENT WIZARD:
├─ 2-step wizard (not 3) with progressive reveal
├─ AI auto-fill: Company name → LLM fetches description/industry/size
├─ First stakeholder optional (invite from card later)
├─ Role dropdown: Business Owner, Executive, Manager, Employee
├─ Template auto-select based on industry
└─ Toast + redirect on success

INDUSTRY/SECTOR:
├─ 4 Sectors: Home Services, Professional Services, Industrial, Real Estate
└─ 12 Industries for dropdown

QUARTERLY GOALS:
├─ 1 KR → 4 Quarterly Goals (phased milestones)
├─ Manual creation by consultant/owner/manager (NOT AI)
├─ Simple modal: Title + Target (2 fields only)
├─ Progressive: One quarter at a time
├─ 4 weeks shown per quarter view
└─ Thin quarterly context bar above weekly goals

OBJECTIVES PAGE:
├─ Minimal header, focus on objectives
├─ Expandable summary bar (collapsed by default)
├─ Format: "3 Active • 25% • SSI +0.4 ↑ • 2/6 Categories [▼]"
└─ Keep existing: Category Coverage, Stats Row, Filter Tabs, Cards

USER CONTEXT:
├─ Consultant: Uses company selector, manages multiple clients
├─ Business Owner: Same UI, their company, execution focus
└─ "View As" pattern: Same screens serve both personas
```

### Pending Topics (6 remaining)

| Topic | Key Questions to Answer |
|-------|------------------------|
| **Weekly Goals** | How many per quarterly goal? AI or manual creation? |
| **Tasks** | One-off vs repetitive distinction in UI? Daily view design? |
| **Dashboard** | Different view for consultant vs business owner? |
| **Planning Page** | Full design review (integrate quarterly + weekly) |
| **Teams Page** | Assessment per member or per team? Role management? |
| **Assessment Page** | List view? History? Comparison between assessments? |

---

## Pre-Session Review

### Documents to Read Before Session

**Strategy Documents** (all must be complete):
1. ✅ [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)
2. ✅ [OBJECTIVE_CREATION_STRATEGY.md](../../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md)
3. ✅ COMPANY_PROFILE_STRATEGY.md (created in Session #165)
4. ✅ LLM_ORCHESTRATION_STRATEGY.md (created in Session #166)
5. ✅ [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md)

**Foundation Documents**:
1. [YSELA_PHILOSOPHY.md](../../../../../YSELA/philosophy/YSELA_PHILOSOPHY.md)
2. [00_MASTER_IMPLEMENTATION_PLAN.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md)

**Current Codebase**:
- Review existing models: Company, Objective, Task, Assessment, User
- Review current API structure
- Review frontend architecture (pages, scripts)

---

## Session Agenda

### Part 1: Integration Architecture (45 min)

**Goal**: Document how all LEGO pieces connect

**Create Visual Architecture Diagram**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSULTANT WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Add Client (My Clients Tab) ✅ DESIGNED                │
│  ├─ 2-step wizard with progressive reveal                       │
│  ├─ AI auto-fill: Name → LLM fetches description/industry/size  │
│  ├─ First stakeholder optional (invite from card later)         │
│  └─ Template auto-select based on industry                      │
│                                                                  │
│  Step 2: Run SSI Assessment                                     │
│  ├─ Existing assessment flow                                    │
│  ├─ Calculate sub-dimension scores                              │
│  ├─ Identify constraint                                         │
│  └─ Store in Assessment model                                   │
│                                                                  │
│  Step 3: Create Objective (3-Screen Wizard) ✅ DESIGNED         │
│  ├─ Screen 1: Input objective + Select SSI + Select behaviors   │
│  ├─ Screen 2: LLM Context Assembly Service                      │
│  │   ├─ Fetch: Company profile                                  │
│  │   ├─ Fetch: Latest assessment                                │
│  │   ├─ Fetch: Selected behaviors                               │
│  │   ├─ Load: Vertical insights                                 │
│  │   ├─ Assemble: Complete context                              │
│  │   ├─ Render: Prompt template                                 │
│  │   └─ Call: OpenAI API → Get KRs + Guidance                   │
│  └─ Screen 3: Review, edit, confirm                             │
│                                                                  │
│  Step 4: Create Quarterly Goals ✅ DESIGNED                     │
│  ├─ 1 KR → 4 Quarterly Goals (phased milestones)                │
│  ├─ Simple modal: Title + Target (2 fields)                     │
│  ├─ Consultant/owner creates manually (not AI)                  │
│  └─ 4 weeks shown per quarter                                   │
│                                                                  │
│  Step 5: Create Weekly Goals ⏳ PENDING DESIGN                  │
│  ├─ From quarterly goals                                        │
│  └─ LLM generates tasks (one-off + repetitive)                  │
│                                                                  │
│  Step 6: View Analytics (Simple) ⏳ PENDING DESIGN              │
│  └─ SSI coverage, behavior focus, task breakdown                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow Diagram**:

```
Company Profile   Assessment     Behaviors      Vertical Insights
(business_profile) (SSI scores)  (9 Disciplines) (Industry patterns)
      ↓               ↓               ↓                ↓
      └───────────────┴───────────────┴────────────────┘
                           ↓
              LLM Context Assembly Service
                           ↓
               Prompt Template Renderer
                           ↓
                    OpenAI API Call
                           ↓
            KRs + Guidance (JSON response)
                           ↓
         Parse, Validate, Return to UI
                           ↓
                Objective Created (with KRs)
                           ↓
      ┌──────────────────┬─────────────────┐
      ↓                  ↓                 ↓
Quarterly Goals    Analytics Update    Workflow Continues
```

**API Dependency Chain**:

| API Call | Depends On | Response Time | Fallback |
|----------|-----------|---------------|----------|
| GET /api/behaviors | None (seeded) | <50ms | Error if empty |
| GET /api/companies/:id | None | <100ms | Error if not found |
| GET /api/assessments/latest/:companyId | Assessment run | <200ms | Return null, warn user |
| POST /api/ai/generate-key-results | All above + LLM | <15s median | Manual KR entry |
| POST /api/objectives | KRs ready | <500ms | Standard errors |

**Output**: INTEGRATION_STRATEGY.md with diagrams

---

### Part 2: Epic Breakdown (60 min)

**Sprint 22 Epic Structure**:

```
SPRINT 22: BETA_FINAL (42 Story Points)

├─ EPIC A: LEGO PIECE - BEHAVIOR MODEL (5 points)
│  ├─ Story A1: Create Behavior model (2 points)
│  ├─ Story A2: Seed 9 Disciplines (1 point)
│  ├─ Story A3: GET /api/behaviors endpoint (1 point)
│  └─ Story A4: Unit tests for Behavior model (1 point)
│
├─ EPIC B: LEGO PIECE - COMPANY PROFILE (8 points)
│  ├─ Story B1: Extend Company model (business_profile) (2 points)
│  ├─ Story B2: Company onboarding wizard UI (3 points)
│  ├─ Story B3: PUT /api/companies/:id/profile endpoint (1 point)
│  ├─ Story B4: My Clients page enhancements (profile indicator) (2 points)
│
├─ EPIC C: LEGO PIECE - ASSESSMENT SUB-DIMENSIONS (5 points)
│  ├─ Story C1: Extend Assessment model (sub_dimension scores) (2 points)
│  ├─ Story C2: Calculate constraint logic (1 point)
│  ├─ Story C3: Update assessment questions mapping (1 point)
│  └─ Story C4: Migration for existing assessments (1 point)
│
├─ EPIC D: SERVICE - LLM ORCHESTRATION (10 points)
│  ├─ Story D1: Create LLMOrchestrationService (3 points)
│  ├─ Story D2: Context assembly logic (2 points)
│  ├─ Story D3: Prompt template renderer (1 point)
│  ├─ Story D4: Vertical insights knowledge base (2 points)
│  ├─ Story D5: POST /api/ai/generate-key-results endpoint (1 point)
│  └─ Story D6: Error handling and retries (1 point)
│
├─ EPIC E: UI - OBJECTIVE CREATION WIZARD (10 points)
│  ├─ Story E1: Screen 1 - Objective setup UI (3 points)
│  ├─ Story E2: Screen 2 - LLM loading state UI (2 points)
│  ├─ Story E3: Screen 3 - Review and edit UI (3 points)
│  ├─ Story E4: Validation and error messages (1 point)
│  └─ Story E5: Integration testing (end-to-end) (1 point)
│
├─ EPIC F: MODEL EXTENSIONS (4 points)
│  ├─ Story F1: Extend Objective model (ssi_impact, behavior_ids, ai_guidance) (2 points)
│  ├─ Story F2: Migration for existing objectives (1 point)
│  └─ Story F3: Update Objective API endpoints (1 point)
│
└─ EPIC G: ANALYTICS (SIMPLE) (5 points - Optional/Deferred)
   ├─ Story G1: GET /api/analytics/ssi-coverage endpoint (1 point)
   ├─ Story G2: GET /api/analytics/behavior-focus endpoint (1 point)
   ├─ Story G3: Analytics dashboard UI (2 points)
   └─ Story G4: Gap warnings logic (1 point)
```

**Epic Prioritization**:

| Epic | Priority | Blocker For | Can Defer? |
|------|----------|-------------|-----------|
| A: Behavior Model | P0 (Critical) | E, F | No - required for objective creation |
| B: Company Profile | P1 (High) | D | Partial - can launch with generic KRs |
| C: Assessment Sub-dimensions | P2 (Medium) | E | Yes - can use overall scores |
| D: LLM Orchestration | P0 (Critical) | E | No - core value prop |
| E: Objective Wizard | P0 (Critical) | None | No - user-facing feature |
| F: Model Extensions | P0 (Critical) | E | No - required for data storage |
| G: Analytics | P3 (Nice-to-have) | None | Yes - post-beta acceptable |

**Output**: Epic breakdown with story points

---

### Part 3: Technical Specifications (45 min)

**For Each Epic, Document**:

1. **Database Changes**:
   - Schema additions
   - Indexes needed
   - Migration scripts

2. **API Endpoints**:
   - Method, path, auth
   - Request/response schemas
   - Error codes

3. **Business Logic**:
   - Validation rules
   - Processing steps
   - Edge cases

4. **Frontend Components**:
   - Component hierarchy
   - State management
   - Event handlers

5. **Testing Requirements**:
   - Unit test coverage
   - Integration tests
   - E2E scenarios

**Example: Epic A - Behavior Model**:

```markdown
### Epic A: Behavior Model

**Database Changes**:
- New collection: `behaviors`
- Schema: See Behavior model spec
- Indexes: `{ status: 1, display_order: 1 }`, `{ foundation: 1, status: 1 }`
- Seed script: `/server/seeders/behaviors.seed.js`

**API Endpoints**:
- `GET /api/behaviors` - List all active behaviors
  - Auth: Required (any authenticated user)
  - Response: `{ behaviors: [...] }`
  - Filters: `?status=active` (default)
  - Population: Include foundation info

**Business Logic**:
- On app startup: Check if behaviors seeded, if not, auto-seed
- Status transitions: active ↔ archived (soft delete)
- Global behaviors: is_global = true (for beta)

**Frontend**:
- Behavior selector component (multi-select checkboxes)
- Group by foundation
- Show count of selected behaviors
- Warn if >3 selected

**Testing**:
- Unit: Behavior model CRUD operations
- Unit: Seed script execution
- Integration: GET /api/behaviors
- E2E: Behavior selection in objective wizard
```

**Output**: Technical specs for all epics

---

### Part 4: Acceptance Criteria & Definition of Done (30 min)

**Sprint-Level Acceptance Criteria**:

```
Sprint 22 is DONE when:
✅ Consultant can add client with complete business profile
✅ Consultant can create objective with SSI impact and behaviors selected
✅ LLM generates 3-5 outcome-based KRs with guidance
✅ KRs measure business impact (time/cost/quality), not just activities
✅ AI guidance shows why behaviors matter and expected SSI impact
✅ Consultant can edit or manually add KRs
✅ Objective saved with ssi_impact, behavior_ids, ai_guidance fields
✅ All data models extended with no breaking changes
✅ Graceful degradation: Works without complete company profile
✅ Error handling: LLM timeout/failure shows friendly message and manual fallback
✅ Internal testing: 5 consultants create 10 objectives successfully
✅ Performance: LLM generation <20s median, <35s p95
✅ Documentation: User guide for consultants created
```

**Epic-Level Definition of Done**:

For each epic, story is DONE when:
- [ ] Code written and peer-reviewed
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests written and passing
- [ ] API documentation updated (if applicable)
- [ ] Frontend components responsive (desktop + tablet)
- [ ] Error handling implemented with user-friendly messages
- [ ] Accessibility: Keyboard navigation + screen reader support
- [ ] Security: XSS prevention, RBAC enforced, multi-tenant isolation
- [ ] Performance: Meets targets (API <500ms, DB queries optimized)
- [ ] Deployed to dev environment and smoke tested
- [ ] Demoed to product owner and approved

**Output**: Acceptance criteria checklist

---

### Part 5: 6-Week Execution Roadmap (30 min)

**Weekly Breakdown**:

```
WEEK 1 (Apr 21-27): Sprint 22.1 - Foundation
├─ Epic A: Behavior Model (COMPLETE)
├─ Epic F: Model Extensions (COMPLETE)
├─ Epic C: Assessment Sub-dimensions (COMPLETE)
└─ Epic B: Company Profile backend (50%)

Deliverables:
✅ Behaviors seeded
✅ Objective model extended
✅ Assessment model extended
⚠️ Company profile model extended (in progress)

WEEK 2 (Apr 28-May 4): Sprint 22.1 - Foundation (cont.)
├─ Epic B: Company Profile (COMPLETE)
├─ Epic D: LLM Orchestration (80%)
└─ Vertical insights knowledge base (3 industries seeded)

Deliverables:
✅ Company onboarding wizard complete
✅ LLM Context Assembly Service working
⚠️ Vertical insights (3/5 industries done)

WEEK 3 (May 5-11): Sprint 22.2 - Objective Wizard
├─ Epic E: Objective Wizard Screen 1 (COMPLETE)
├─ Epic E: Objective Wizard Screen 2 (COMPLETE)
└─ Epic D: LLM Orchestration (COMPLETE)

Deliverables:
✅ Screen 1 working (objective + SSI + behaviors)
✅ Screen 2 working (LLM loading + preview)
✅ LLM integration end-to-end tested

WEEK 4 (May 12-18): Sprint 22.2 - Objective Wizard (cont.)
├─ Epic E: Objective Wizard Screen 3 (COMPLETE)
├─ Epic E: Validation and error messages (COMPLETE)
└─ Epic E: End-to-end testing (COMPLETE)

Deliverables:
✅ 3-screen wizard fully functional
✅ Error handling comprehensive
✅ Manual KR entry working

WEEK 5 (May 19-25): Sprint 22.3 - Polish & Launch Prep
├─ Epic G: Analytics (Simple) (COMPLETE)
├─ Bug fixes from testing
├─ Consultant training materials
└─ Beta launch to 3-5 consultants

Deliverables:
✅ Analytics dashboard visible
✅ Known bugs fixed
✅ Training materials ready
✅ Beta launched

WEEK 6 (May 26-Jun 1): Sprint 22.4 - Feedback & Iterate
├─ Monitor adoption metrics
├─ Collect consultant feedback
├─ Tune LLM prompts based on edit rates
└─ Bug fixes + UX improvements

Deliverables:
✅ Feedback collected
✅ Prompt improvements deployed
✅ Sprint retrospective complete
```

**Output**: Week-by-week roadmap

---

### Part 6: Risk Assessment & Mitigation (20 min)

**Identified Risks**:

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| LLM quality lower than expected | Medium | High | A/B test prompts, allow manual KR entry always |
| Company profile incomplete (consultants skip) | High | Medium | Make optional, warn about quality impact |
| Assessment sub-dimensions too complex | Low | Medium | Can defer, use overall scores for beta |
| 6 weeks too aggressive | Medium | High | Epic G (Analytics) is optional, can defer |
| OpenAI API cost higher than estimated | Low | Low | Monthly cost <$5 for beta, not a concern |
| Consultant adoption low | Medium | High | Training materials + onboarding critical |
| Performance issues (LLM slow) | Medium | Medium | Timeout at 30s, retry logic, cache context |
| Vertical insights incomplete | Medium | Low | Start with 3 industries, expand post-beta |

**Mitigation Strategy**:
- Priority 0 epics (A, D, E, F) are non-negotiable
- Epic G (Analytics) can be deferred to Week 7 if needed
- Epic C (Assessment sub-dimensions) can use overall scores as fallback
- Weekly check-ins to monitor progress vs timeline
- Feature flags to control rollout (beta consultants only)

**Output**: Risk register with mitigation plans

---

## Session Deliverables

### Must Create in Session

1. **INTEGRATION_STRATEGY.md**
   - Architecture diagrams
   - Data flow documentation
   - API dependency chains
   - LEGO piece boundaries

2. **SPRINT-22-MASTER-PLAN.md**
   - Epic breakdown (42 story points)
   - Story descriptions
   - Acceptance criteria
   - Priority and dependencies

3. **TECHNICAL_IMPLEMENTATION_SPECS.md**
   - Database changes per epic
   - API endpoint specifications
   - Business logic documentation
   - Testing requirements

4. **6-WEEK-EXECUTION-ROADMAP.md**
   - Week-by-week deliverables
   - Milestones and checkpoints
   - Resource allocation

5. **RISK_REGISTER.md**
   - Risk assessment
   - Mitigation strategies
   - Contingency plans

---

## Post-Session Actions

### For Product Team
- [ ] Review and approve Sprint 22 Master Plan
- [ ] Validate acceptance criteria
- [ ] Approve 6-week timeline
- [ ] Share with stakeholders

### For Engineering Team
- [ ] Review technical specs
- [ ] Validate story point estimates
- [ ] Identify technical dependencies
- [ ] Set up development environment

### For Design Team
- [ ] Create high-fidelity mockups (all screens)
- [ ] Design system components updated
- [ ] Prototype for user testing

### For All Teams
- [ ] Sprint kickoff meeting (Week 1 Monday)
- [ ] Daily standups schedule
- [ ] Weekly demo schedule
- [ ] Retrospective planning

---

## Success Criteria

**Session is successful if**:
- ✅ All 5 deliverables created and complete
- ✅ Epic breakdown is clear with no ambiguity
- ✅ Technical specs are implementable
- ✅ 6-week timeline is realistic and approved
- ✅ Risks identified with mitigation plans
- ✅ Team alignment on priorities and scope

**Ready to start Sprint 22 when**:
- Engineering team can start Epic A immediately
- Design team has all specs for mockups
- Product owner has approved scope and timeline
- No blocking questions remain

---

## Related Documents

**Input Documents** (all must be complete):
- All strategy docs from Sessions #164-166
- [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)

**Output Documents** (to be created in session):
- `INTEGRATION_STRATEGY.md` → `KARVIA_STRATEGY/2-TECHNICAL/`
- `SPRINT-22-MASTER-PLAN.md` → `SPRINT-22-Beta_Final/`
- `TECHNICAL_IMPLEMENTATION_SPECS.md` → `SPRINT-22-Beta_Final/implementation/`
- `6-WEEK-EXECUTION-ROADMAP.md` → `SPRINT-22-Beta_Final/implementation/`
- `RISK_REGISTER.md` → `SPRINT-22-Beta_Final/implementation/`

**Previous Sessions**:
- [SESSION_164_OBJECTIVE_PAGE.md](./SESSION_164_OBJECTIVE_PAGE.md)
- [SESSION_165_COMPANY_PROFILE.md](./SESSION_165_COMPANY_PROFILE.md)
- [SESSION_166_LLM_ORCHESTRATION.md](./SESSION_166_LLM_ORCHESTRATION.md)

---

**Session Owner**: Full Team (Product, Engineering, Design)
**Created**: April 20, 2026
**Updated**: April 20, 2026 (Brainstorm progress: 7/13 topics)
**Status**: In Progress - Continue with remaining 6 topics, then create deliverables

