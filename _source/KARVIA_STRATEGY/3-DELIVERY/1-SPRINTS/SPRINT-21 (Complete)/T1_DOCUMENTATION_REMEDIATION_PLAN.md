# T1 Documentation Remediation Plan

<!-- @GENOME T3-SPR-021-PLAN | ACTIVE | 2026-04-06 | parent:T3-SPR-021 | auto:/strategy | linked:/init -->

**Created**: April 6, 2026 (Session #155)
**Purpose**: Comprehensive plan to finalize T0/T1 documentation for KARVIA and YSELA
**Status**: PLANNING COMPLETE - Ready for Execution
**Total Estimated Effort**: 9-10 hours across 4 sessions

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Framework: KARVIA vs YSELA](#3-framework-karvia-vs-ysela)
4. [Issues Catalog](#4-issues-catalog)
5. [Session Roadmap](#5-session-roadmap)
6. [Session 2: KARVIA Audit & Lock](#6-session-2-karvia-audit--lock)
7. [Session 3: YSELA T0 Shaping](#7-session-3-ysela-t0-shaping-discussion)
8. [Session 4: YSELA T0 Finalization](#8-session-4-ysela-t0-finalization)
9. [Session 5: YSELA T1 Documentation](#9-session-5-ysela-t1-documentation)
10. [File Inventory](#10-file-inventory)
11. [Success Criteria](#11-success-criteria)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### What This Plan Addresses

This plan documents the complete remediation needed to finalize T0 and T1 level documentation for both KARVIA (engine layer) and YSELA (product layer), ensuring:

- **KARVIA**: Stable, locked engine documentation with no product-layer contamination
- **YSELA**: Coherent product identity with no internal contradictions

### Key Findings from Audit (Session #155)

| Category | Finding | Severity |
|----------|---------|----------|
| GRIT Definition | Two conflicting definitions exist | **Critical** |
| Football Metaphors | Used as guidelines, conflicts with Coach Persona | **Critical** |
| User Journeys | 3 critical documents missing | **Critical** |
| UI Changes | Mislabeled as "zero changes" | **Major** |
| Legacy Succession | Over-emphasized as "primary" vertical | **Minor** |
| Beta Date | Inconsistent (Apr 10 vs Apr 17) | **Minor** |

### Approach

```
KARVIA (Engine)              YSELA (Product)
═══════════════              ═══════════════
Status: STABLE               Status: NEEDS SHAPING

Approach:                    Approach:
AUDIT → FIX → LOCK          DISCUSS → DEFINE → DOCUMENT

1 Session                    3 Sessions
```

---

## 2. Current State Analysis

### 2.1 Documents Reviewed (Session #155)

| Document | Type | Status | Issues |
|----------|------|--------|--------|
| ECOSYSTEM_ARCHITECTURE.md | T1-ARC | Good | Minor date issue |
| KARVIA_ENGINE_VISION.md | T1-KRV | Good | Clean |
| KARVIA_1.0_CAPABILITIES.md | T2-ARC | Good | Baseline locked |
| YSELA_PHILOSOPHY.md | T1-PRD | Issues | Football, GRIT |
| YSELA_VISION.md | T1-PRD | Issues | Football refs |
| YSELA/README.md | T1-NAV | Issues | Wrong GRIT def |
| BBB_FRAMEWORK.md | T2-PRD | Minor | Position refs |
| UX_PRINCIPLES.md | T2-PRD | Good | GRIT ref needs update |
| CONSULTANT_METHODOLOGY.md | T2-PRD | Excellent | No issues |
| COACH_PERSONA.md | T2-PRD | Good | Source of truth for tone |
| BETA_ROADMAP_2026.md | T1-PRD | Issues | Multiple |
| PBL_GAMIFICATION.md | T2-PRD | Minor | Position refs |

### 2.2 What's Working Well

1. **Three-layer architecture** (iBrain → YSELA → KARVIA) is clearly defined
2. **KARVIA engine baseline** is locked with 1,491 tests
3. **Consultant methodology** is comprehensive and actionable
4. **Coach persona** provides clear tone guidelines
5. **UX principles** are thorough (GRIT-UX framework)
6. **BBB framework** provides solid philosophical foundation

### 2.3 What Needs Work

1. **YSELA identity** is not narrowed down - still has contradictions
2. **GRIT** has two different definitions
3. **Football metaphors** conflict with stated guidelines
4. **User journeys** don't exist (marked "TO CREATE")
5. **UI scope** is mislabeled

---

## 3. Framework: KARVIA vs YSELA

### 3.1 The LEGO Principle

Everything in this ecosystem must be **modular, independent, and composable**:

```
┌─────────────────────────────────────────────────────────────────┐
│  YSELA (Product Layer)                                          │
│  ─────────────────────                                          │
│  • User-facing brand and experience                             │
│  • Behavior frameworks (BBB, GRIT, PBL)                         │
│  • Coach persona and prompts                                    │
│  • User journeys and methodology                                │
│                                                                 │
│  Language: Next Move, Focus, Priority, Coach, Behavior          │
│                                                                 │
│  CAN wrap any OKR engine (not just KARVIA)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                    (Clean Interface)
                    Terminology Mapping
                              │
┌─────────────────────────────────────────────────────────────────┐
│  KARVIA (Engine Layer)                                          │
│  ─────────────────────                                          │
│  • Data models and schemas                                      │
│  • API endpoints and routes                                     │
│  • Authentication and multi-tenancy                             │
│  • Progress calculations                                        │
│                                                                 │
│  Language: Task, Goal, Objective, Key Result, company_id        │
│                                                                 │
│  CAN power any product layer (not just YSELA)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Tier Definitions

#### KARVIA Tiers

| Tier | Name | Purpose | Documents |
|------|------|---------|-----------|
| T0 | Constitutional | Engine governance | CLAUDE.md (engine sections) |
| T1 | Strategic | Engine vision | KARVIA_ENGINE_VISION.md, ECOSYSTEM_ARCHITECTURE.md |
| T2 | Canonical | Technical specs | KARVIA_1.0_CAPABILITIES.md, API docs |

#### YSELA Tiers

| Tier | Name | Purpose | Documents |
|------|------|---------|-----------|
| T0 | Constitutional | Product foundation | Core philosophy, GRIT definition, Principles |
| T1 | Strategic | Product vision | YSELA_VISION.md, User Journeys, Methodology |
| T2 | Canonical | Implementation | UX specs, Coach persona, Gamification |

### 3.3 Terminology Mapping

| KARVIA (Engine) | YSELA (Product) | Notes |
|-----------------|-----------------|-------|
| Task | Next Move | Daily execution item |
| Goal | Priority | Weekly focus |
| Objective | Focus / Objective | Quarterly target |
| User | Team Member | Person in system |
| Status: completed | Done | Task state |
| Status: blocked | Stuck | Needs help |

---

## 4. Issues Catalog

### 4.1 Critical Issues (Must Fix)

#### ISSUE 1: GRIT Definition Conflict

**Location A**: `YSELA/philosophy/YSELA_PHILOSOPHY.md:108-159`
```
G - Growth (observable signals of learning)
R - Reinforce (feedback mechanisms)
I - Invest (engagement signals)
T - Trigger (readiness signals)
```

**Location B**: `YSELA/README.md:137-144`
```
G - Guts (courage to take action)
R - Resilience (bouncing back)
I - Initiative (proactive behavior)
T - Tenacity (persistence)
```

**Problem**: These are fundamentally different concepts - behavior loop vs character trait.

**Decision Needed**: Which definition is canonical?

---

#### ISSUE 2: Football Metaphors as Guidelines

**Location**: `YSELA/philosophy/YSELA_PHILOSOPHY.md:41-106`
- "The Football Match Model" is a core section
- Defines Goalkeeper, Midfield, Defense, Attack as role types
- Presents as THE way to think about roles

**Conflict**: `YSELA/experience/COACH_PERSONA.md:47-50`
```
"avoid sports metaphors unless the user already introduced them"
```

**Problem**: Core philosophy document uses what Coach Persona says to avoid.

**Decision Needed**: Remove football as guideline, keep as optional example?

---

#### ISSUE 3: Missing User Journey Documents

**Location**: `YSELA/README.md:49-56` lists as "TO CREATE":
- `CONSULTANT_EXPERIENCE.md` (P1)
- `BUSINESS_OWNER_EXPERIENCE.md` (P1)
- `EMPLOYEE_EXPERIENCE.md` (P1)

**Problem**: Cannot train consultants or onboard pilots without these.

**Action Needed**: Create all three documents.

---

### 4.2 Major Issues (Should Fix)

#### ISSUE 4: UI Changes Mislabeled

**Location**: `BETA_ROADMAP_2026.md` Section 17 (CTO Perspective)
```
"Zero UI changes"
"Tasks label stays"
```

**Reality**: `UX_PRINCIPLES.md:876-913` defines 10 UX stories totaling 20 story points:
- UX-001: FTUE Welcome Flow (3 pts)
- UX-002: Empty States (2 pts)
- UX-003: Feature Unlock System (3 pts)
- UX-004: Contextual Hints (2 pts)
- UX-005: Toast System (2 pts)
- UX-006: Celebration Hierarchy (2 pts)
- UX-007: Personalization Storage (2 pts)
- UX-008: History/Progress View (1 pt)
- UX-009: Full Empty State Library (1 pt)
- UX-010: UX Audit & Fixes (2 pts)

**Problem**: "Zero UI changes" is inaccurate.

**Clarification Needed**: "Zero UI label changes" + "UX enhancements planned"

---

#### ISSUE 5: Legacy Succession Over-Emphasis

**Locations**:
- `BETA_ROADMAP_2026.md:720-749` - "Primary Beta Example"
- `BETA_ROADMAP_2026.md:781` - "Confirm Legacy Succession as lead beta vertical"

**Problem**: Presents as THE vertical, not AN example.

**Reframe Needed**: One example among many, not primary requirement.

---

### 4.3 Minor Issues (Nice to Fix)

#### ISSUE 6: Beta Date Inconsistency

- `ECOSYSTEM_ARCHITECTURE.md:229` says "Apr 10, 2026"
- `BETA_ROADMAP_2026.md:9` says "Apr 17, 2026"

**Fix**: Update to Apr 17 everywhere.

---

### 4.4 Technical Issues

#### ISSUE 7: Port Conflict (Future)

KARVIA microservices and future iBrain engines have overlapping ports:
- KARVIA IAM: 8081 | iBrain Tracking: 8081
- KARVIA Assessment: 8082 | iBrain Observer: 8082

**Action**: Document port allocation strategy for future.

---

## 5. Session Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SESSION OVERVIEW                                   │
├──────────┬─────────────────────┬──────────┬─────────────────────────────────┤
│ Session  │ Focus               │ Duration │ Type                            │
├──────────┼─────────────────────┼──────────┼─────────────────────────────────┤
│ 2        │ KARVIA Audit & Lock │ 2 hrs    │ Audit/Fix                       │
├──────────┼─────────────────────┼──────────┼─────────────────────────────────┤
│ 3        │ YSELA T0 Shaping    │ 2-3 hrs  │ DISCUSSION (decisions needed)   │
├──────────┼─────────────────────┼──────────┼─────────────────────────────────┤
│ 4        │ YSELA T0 Finalize   │ 2 hrs    │ Documentation                   │
├──────────┼─────────────────────┼──────────┼─────────────────────────────────┤
│ 5        │ YSELA T1 Docs       │ 3 hrs    │ Documentation                   │
├──────────┼─────────────────────┼──────────┼─────────────────────────────────┤
│ TOTAL    │                     │ 9-10 hrs │                                 │
└──────────┴─────────────────────┴──────────┴─────────────────────────────────┘
```

### Session Dependencies

```
Session 2 (KARVIA)     Session 3 (YSELA T0 Shaping)
        │                        │
        │                        ▼
        │              Session 4 (YSELA T0 Finalize)
        │                        │
        │                        ▼
        └──────────────► Session 5 (YSELA T1 Docs)
                                 │
                                 ▼
                        ALL T0/T1 LOCKED
```

- Sessions 2 and 3 can run in parallel (independent)
- Session 4 requires Session 3 complete
- Session 5 requires Session 4 complete

---

## 6. Session 2: KARVIA Audit & Lock

### Objective
Verify KARVIA engine documentation is complete, accurate, and locked as stable baseline.

### Duration
~2 hours

### Pre-Requisites
- None (can start immediately)

### Tasks

| # | Task | File | Action | Time |
|---|------|------|--------|------|
| 2.1 | Audit KARVIA_ENGINE_VISION.md | `KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md` | Review for accuracy, no YSELA leakage | 15 min |
| 2.2 | Audit KARVIA_1.0_CAPABILITIES.md | `KARVIA_STRATEGY/1-PRODUCT/KARVIA_1.0_CAPABILITIES.md` | Verify baseline matches code reality | 20 min |
| 2.3 | Audit ECOSYSTEM_ARCHITECTURE.md | Root directory | Review engine sections only | 15 min |
| 2.4 | Audit PRODUCT_ARCHITECTURE.md | `KARVIA_STRATEGY/1-PRODUCT/PRODUCT_ARCHITECTURE.md` | Verify technical accuracy | 15 min |
| 2.5 | Check YSELA contamination | All KARVIA docs | Grep for YSELA terms (Coach, Next Move, BBB, GRIT) | 10 min |
| 2.6 | Fix beta date | ECOSYSTEM_ARCHITECTURE.md | Change Apr 10 → Apr 17 | 2 min |
| 2.7 | Document port strategy | NEW: `KARVIA_STRATEGY/2-TECHNICAL/PORT_ALLOCATION.md` | Future iBrain compatibility | 15 min |
| 2.8 | Create KARVIA_BASELINE_LOCK.md | NEW: `KARVIA_STRATEGY/1-VISION/KARVIA_BASELINE_LOCK.md` | Lock document | 20 min |
| 2.9 | Update genome tags | All modified files | Current dates | 5 min |
| 2.10 | Update SESSION_LOG.md | `.claude/SESSION_LOG.md` | Record session | 5 min |

### KARVIA Contamination Check

Verify these terms do NOT appear in KARVIA docs:
- [ ] "Coach" (YSELA persona)
- [ ] "Next Move" (YSELA term for Task)
- [ ] "BBB" (YSELA framework)
- [ ] "GRIT" (YSELA framework)
- [ ] "PBL" (YSELA gamification)
- [ ] "Focus" as noun (YSELA term)
- [ ] "Priority" as work item (YSELA term)

### Exit Criteria

- [ ] All KARVIA docs reviewed
- [ ] No YSELA terminology in engine docs
- [ ] Technical accuracy verified
- [ ] Port allocation documented
- [ ] Baseline lock document created
- [ ] KARVIA declared STABLE

### Deliverables

| File | Type | Description |
|------|------|-------------|
| `KARVIA_BASELINE_LOCK.md` | New | Declaration that engine baseline is locked |
| `PORT_ALLOCATION.md` | New | Port strategy for future iBrain |
| `ECOSYSTEM_ARCHITECTURE.md` | Edit | Date fix |

---

## 7. Session 3: YSELA T0 Shaping (DISCUSSION)

### Objective
Through discussion, define YSELA's fundamental identity. This session produces DECISIONS, not documents.

### Duration
~2-3 hours

### Pre-Requisites
- None (can run parallel with Session 2)
- Requires human input on key decisions

### Discussion Topics

#### Topic 3.1: Core Identity

**Question**: What is YSELA in ONE sentence?

**Current options**:
1. "YSELA uses the current execution stack to guide handoffs, ownership, and next moves."
2. "YSELA is a behavior transformation system that helps service businesses achieve goals through habit formation."
3. Something else?

**Decision needed**: [ ] Final one-sentence identity

---

#### Topic 3.2: Core Belief

**Question**: Is BBB (Behavior Based Business) the foundation?

**Current state**: BBB is documented but relationship to YSELA is implicit.

**Questions to answer**:
- Is "behavior-first" the core differentiator?
- What does behavior-first mean practically?
- How does BBB relate to GRIT?

**Decision needed**: [ ] Confirm BBB as foundation or define alternative

---

#### Topic 3.3: GRIT Definition

**Question**: What is GRIT - behavior loop or character trait?

**Option A - Behavior Loop** (from YSELA_PHILOSOPHY.md):
```
G - Growth      (observable signals of learning)
R - Reinforce   (feedback mechanisms)
I - Invest      (engagement signals)
T - Trigger     (readiness signals)
```

**Option B - Character Trait** (from YSELA/README.md):
```
G - Guts        (courage to take action)
R - Resilience  (bouncing back)
I - Initiative  (proactive behavior)
T - Tenacity    (persistence)
```

**Recommendation**: Option A aligns with BBB's behavior-first philosophy.

**Decision needed**: [ ] Final GRIT definition

---

#### Topic 3.4: Language and Metaphors

**Question**: If not football, what metaphor (if any)?

**Options**:
1. **No metaphor** - Just use role-based language (Oversight, Coordination, Execution)
2. **Journey metaphor** - Stages, milestones, paths
3. **Orchestra metaphor** - Conductor, sections, harmony
4. **Football as OPTIONAL example** - Available but not required

**Current recommendation**: Option 4 - Keep football as ONE example consultants CAN use, not the default.

**Decision needed**: [ ] Metaphor approach

---

#### Topic 3.5: Non-Negotiable Principles

**Question**: What are 3-5 beliefs YSELA will never compromise?

**Candidates** (from existing docs):
1. Behavior drives outcomes (not goals alone)
2. Diagnose before prescribe (SSI first)
3. Coaches guide, players play (build capability not dependency)
4. Environment over motivation (make right behavior easy)
5. Feedback loops over delayed reviews (real-time signals)

**Decision needed**: [ ] Final 3-5 principles

---

#### Topic 3.6: Target Persona

**Question**: Who is YSELA for?

**Current**: SMBs (50-500 employees) in service businesses

**Clarifications needed**:
- Consultant-led only? Or self-serve later?
- Which verticals? (not just Legacy Succession)
- What size companies?

**Decision needed**: [ ] Persona boundaries

---

#### Topic 3.7: Product Boundaries

**Question**: What is YSELA NOT?

**Candidates**:
- NOT a generic task manager
- NOT just OKR software
- NOT AI magic (AI assists, humans own)
- NOT self-serve PLG (consultant-led)
- NOT enterprise-ready (beta is narrow)

**Decision needed**: [ ] Anti-patterns list

---

#### Topic 3.8: KARVIA Relationship

**Question**: How does YSELA "wrap" KARVIA?

**Current understanding**:
- YSELA owns presentation, KARVIA owns persistence
- YSELA uses behavior language, KARVIA uses technical language
- Clean interface between layers

**Clarifications needed**:
- Is terminology mapping sufficient?
- Are there API-level interfaces to define?

**Decision needed**: [ ] Interface clarity

---

### Exit Criteria

- [ ] Core identity statement agreed
- [ ] BBB relationship clarified
- [ ] GRIT definition finalized (single answer)
- [ ] Metaphor approach decided
- [ ] 3-5 principles documented
- [ ] Persona boundaries defined
- [ ] Anti-patterns listed
- [ ] KARVIA relationship clear

### Deliverable

| File | Type | Description |
|------|------|-------------|
| `YSELA_T0_DECISIONS.md` | New | Session notes with all decisions |

---

## 8. Session 4: YSELA T0 Finalization

### Objective
Document YSELA's foundational identity based on Session 3 decisions.

### Duration
~2 hours

### Pre-Requisites
- Session 3 complete (decisions made)

### Tasks

| # | Task | File | Content | Time |
|---|------|------|---------|------|
| 4.1 | Create GRIT definition | `YSELA/definitions/GRIT.md` | Canonical definition from Session 3 | 20 min |
| 4.2 | Create Principles doc | `YSELA/YSELA_PRINCIPLES.md` | 3-5 core principles | 25 min |
| 4.3 | Create Terminology mapping | `YSELA/definitions/TERMINOLOGY.md` | KARVIA ↔ YSELA terms | 15 min |
| 4.4 | Update YSELA_PHILOSOPHY.md | Existing | Align to decisions, fix football section | 30 min |
| 4.5 | Update YSELA/README.md | Existing | Remove wrong GRIT, update structure | 15 min |
| 4.6 | Create T0 baseline | `YSELA/T0_BASELINE.md` | Lock document | 15 min |
| 4.7 | Update genome tags | All files | Current dates | 5 min |

### YSELA_PHILOSOPHY.md Changes

**Section to rewrite**: "The Football Match Model" (lines 41-106)

**New structure**:
```markdown
## Role-Based Behavior Patterns

YSELA recognizes that different roles require different behavior patterns:

| Role Type | Behavior Pattern | Example Roles |
|-----------|------------------|---------------|
| **Oversight** | Observe broadly, intervene rarely | Executive, Owner |
| **Coordination** | Keep work flowing, connect people | Manager, Team Lead |
| **Execution** | Complete work, signal blockers | Individual Contributor |
| **Guidance** | Coach from sideline, build capability | Consultant |

### Optional: Sports Team Analogy

Some organizations find sports metaphors helpful:
- Oversight = Goalkeeper
- Coordination = Midfield
- Execution = Attack/Defense
- Guidance = Coach

This is one way to explain the model - use whatever language resonates
with your team.
```

### Exit Criteria

- [ ] GRIT definition document created
- [ ] Principles document created
- [ ] Terminology mapping created
- [ ] YSELA_PHILOSOPHY.md aligned (no contradictions)
- [ ] README updated
- [ ] T0 baseline document created

### Deliverables

| File | Type | Description |
|------|------|-------------|
| `YSELA/definitions/GRIT.md` | New | Canonical GRIT definition |
| `YSELA/YSELA_PRINCIPLES.md` | New | Core principles |
| `YSELA/definitions/TERMINOLOGY.md` | New | Term mapping |
| `YSELA/T0_BASELINE.md` | New | T0 lock document |
| `YSELA/philosophy/YSELA_PHILOSOPHY.md` | Edit | Aligned to decisions |
| `YSELA/README.md` | Edit | Updated structure |

---

## 9. Session 5: YSELA T1 Documentation

### Objective
Create vision and user journey documents, finalize T1 documentation.

### Duration
~3 hours

### Pre-Requisites
- Session 4 complete (T0 locked)

### Tasks

| # | Task | File | Content | Time |
|---|------|------|---------|------|
| 5.1 | Finalize YSELA_VISION.md | `YSELA/vision/YSELA_VISION.md` | Align to T0 decisions | 25 min |
| 5.2 | Create CONSULTANT_EXPERIENCE.md | `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md` | Full journey | 35 min |
| 5.3 | Create BUSINESS_OWNER_EXPERIENCE.md | `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md` | Full journey | 35 min |
| 5.4 | Create EMPLOYEE_EXPERIENCE.md | `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md` | Full journey | 25 min |
| 5.5 | Create journeys README | `YSELA/user-journeys/README.md` | Navigation hub | 10 min |
| 5.6 | Review CONSULTANT_METHODOLOGY.md | Existing | Align to T0 language | 15 min |
| 5.7 | Review BBB_FRAMEWORK.md | Existing | Remove football positions | 15 min |
| 5.8 | Review PBL_GAMIFICATION.md | Existing | Align to T0 | 10 min |
| 5.9 | Clarify UI scope | `BETA_ROADMAP_2026.md` | Precise language | 10 min |
| 5.10 | Reframe Legacy Succession | `BETA_ROADMAP_2026.md` | Example not primary | 10 min |
| 5.11 | Create T1 baseline | `YSELA/T1_BASELINE.md` | Lock document | 15 min |
| 5.12 | Final validation | All YSELA docs | Cross-reference check | 15 min |

### User Journey Document Outlines

#### CONSULTANT_EXPERIENCE.md
```
1. Persona Summary
   - Multi-client consultant (5-15 companies)
   - Goal: Build client capability, not dependency

2. Journey Phases
   - Phase 1: Client Discovery (Week 1)
   - Phase 2: SSI Diagnosis (Week 2)
   - Phase 3: Team/Objective Design (Week 3)
   - Phase 4: Weekly Execution (Weeks 4-12)
   - Phase 5: Transition & Graduation

3. Key Screens & Interactions
   - Multi-client dashboard
   - SSI report review
   - Intervention triggers

4. YSELA Coach Interactions
   - What prompts consultant sees
   - What guidance system provides

5. Success Metrics
   - Client independence
   - Objective completion
   - SSI improvement
```

#### BUSINESS_OWNER_EXPERIENCE.md
```
1. Persona Summary
   - Owner/executive of SMB (50-500 employees)
   - Pain: "Everything comes back to me"
   - Goal: Build scalable handoffs

2. Journey Phases
   - Phase 1: Initial Assessment
   - Phase 2: Seeing the Constraint
   - Phase 3: Designing the Solution
   - Phase 4: Observing Progress
   - Phase 5: Celebrating Transformation

3. Key Screens & Interactions
   - Company dashboard
   - SSI results
   - Exception handling

4. YSELA Coach Interactions
   - Progress summaries
   - Exception alerts

5. Before/After
   - Before: 45 approvals/week
   - After: 8 exceptions/week
```

#### EMPLOYEE_EXPERIENCE.md
```
1. Persona Summary
   - Individual contributor
   - Need: Know what to do next
   - Goal: Complete meaningful work

2. Journey Phases
   - Phase 1: Onboarding (FTUE)
   - Phase 2: First Week
   - Phase 3: Building Rhythm
   - Phase 4: Engagement
   - Phase 5: Growth

3. Key Screens & Interactions
   - Daily view
   - Task completion
   - Help request
   - Weekly reflection

4. YSELA Coach Interactions
   - Encouragement
   - Guidance
   - Celebration

5. Feature Unlock Progression
   - Level 1: Basic
   - Level 2: Engaged
   - Level 3: Invested
```

### Exit Criteria

- [ ] YSELA_VISION.md finalized
- [ ] All 3 user journeys created
- [ ] CONSULTANT_METHODOLOGY.md aligned
- [ ] BBB_FRAMEWORK.md cleaned
- [ ] BETA_ROADMAP.md clarified
- [ ] No internal contradictions
- [ ] T1 baseline document created

### Deliverables

| File | Type | Description |
|------|------|-------------|
| `YSELA/vision/YSELA_VISION.md` | Edit | Finalized vision |
| `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md` | New | Consultant journey |
| `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md` | New | Owner journey |
| `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md` | New | Employee journey |
| `YSELA/user-journeys/README.md` | New | Navigation |
| `YSELA/T1_BASELINE.md` | New | T1 lock document |
| Multiple existing files | Edit | Alignment fixes |

---

## 10. File Inventory

### 10.1 Files to CREATE

| File | Session | Priority |
|------|---------|----------|
| `KARVIA_STRATEGY/1-VISION/KARVIA_BASELINE_LOCK.md` | 2 | P0 |
| `KARVIA_STRATEGY/2-TECHNICAL/PORT_ALLOCATION.md` | 2 | P1 |
| `YSELA_T0_DECISIONS.md` | 3 | P0 |
| `YSELA/definitions/GRIT.md` | 4 | P0 |
| `YSELA/YSELA_PRINCIPLES.md` | 4 | P0 |
| `YSELA/definitions/TERMINOLOGY.md` | 4 | P0 |
| `YSELA/T0_BASELINE.md` | 4 | P0 |
| `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md` | 5 | P0 |
| `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md` | 5 | P0 |
| `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md` | 5 | P0 |
| `YSELA/user-journeys/README.md` | 5 | P1 |
| `YSELA/T1_BASELINE.md` | 5 | P0 |

**Total new files**: 12

### 10.2 Files to MODIFY

| File | Session | Change Type |
|------|---------|-------------|
| `ECOSYSTEM_ARCHITECTURE.md` | 2 | Minor (date) |
| `YSELA/philosophy/YSELA_PHILOSOPHY.md` | 4 | Major (football, GRIT) |
| `YSELA/README.md` | 4, 5 | Moderate (GRIT, structure) |
| `YSELA/vision/YSELA_VISION.md` | 5 | Moderate (alignment) |
| `YSELA/philosophy/BBB_FRAMEWORK.md` | 5 | Minor (positions) |
| `YSELA/experience/PBL_GAMIFICATION.md` | 5 | Minor (positions) |
| `YSELA/experience/UX_PRINCIPLES.md` | 5 | Minor (GRIT ref) |
| `YSELA/methodology/CONSULTANT_METHODOLOGY.md` | 5 | Minor (alignment) |
| `BETA_ROADMAP_2026.md` | 5 | Moderate (UI scope, Legacy) |

**Total files to modify**: 9

### 10.3 Files to REVIEW ONLY

| File | Session | Purpose |
|------|---------|---------|
| `KARVIA_ENGINE_VISION.md` | 2 | Verify accuracy |
| `KARVIA_1.0_CAPABILITIES.md` | 2 | Verify baseline |
| `PRODUCT_ARCHITECTURE.md` | 2 | Verify technical |
| `COACH_PERSONA.md` | 4 | Reference for tone |

---

## 11. Success Criteria

### Overall Success

| Criterion | Verification |
|-----------|--------------|
| KARVIA docs have zero YSELA language | Grep check passes |
| YSELA docs have zero KARVIA engine details | Grep check passes |
| GRIT has ONE definition | Single canonical file |
| No internal contradictions | Cross-reference check |
| All user journeys exist | 3 files created |
| T0 and T1 locked for both layers | Lock documents exist |

### LEGO Compliance

| Check | Verification |
|-------|--------------|
| KARVIA standalone | Engine docs work without YSELA |
| YSELA standalone | Product docs could wrap different engine |
| Clean interface | ECOSYSTEM_ARCHITECTURE defines boundary |
| Terminology mapping | Clear translation exists |
| Independent evolution | Each layer can change independently |

### Documentation Quality

| Metric | Target |
|--------|--------|
| All docs have genome tags | 100% |
| No "TO CREATE" markers remain | 0 |
| Cross-references valid | 100% |
| No contradicting statements | 0 |

---

## 12. Appendices

### Appendix A: GRIT Definition Proposal

```markdown
# GRIT - Behavior Observation Loop

GRIT is YSELA's framework for observing and responding to user behavior.

## The Four Signals

| Signal | Full Name | What It Observes | Example Indicators |
|--------|-----------|------------------|-------------------|
| **G** | Growth | Learning and capability development | Skills improving, challenges overcome, reflections deepening |
| **R** | Reinforce | Recognition and feedback flow | Wins celebrated, help provided, positive feedback given |
| **I** | Invest | Engagement and commitment | Time on meaningful work, depth of participation, quality of contributions |
| **T** | Trigger | Readiness for action or intervention | User onboarded, team formed, move blocked, streak at risk |

## Purpose

GRIT enables YSELA Coach to provide timely, relevant guidance based on
observed behavior patterns, not assumptions.

## Relationship to BBB

BBB (Behavior Based Business) is the philosophy.
GRIT is the observation mechanism that makes BBB actionable.

- BBB says: "Change behavior to change outcomes"
- GRIT says: "Here's how we observe and respond to behavior"
```

### Appendix B: Role-Based Behavior Model (Football Replacement)

```markdown
# Role-Based Behavior Patterns

YSELA recognizes that different roles require different behavior patterns.

## Core Role Types

| Role Type | Behavior Pattern | Typical Positions |
|-----------|------------------|-------------------|
| **Oversight** | Observe broadly, intervene rarely | Executive, Owner, Sponsor |
| **Coordination** | Keep work flowing, connect people | Manager, Team Lead |
| **Execution** | Complete work, signal blockers | Individual Contributor |
| **Guidance** | Coach from sideline, build capability | Consultant |

## Behavior Expectations by Role

### Oversight
- See the whole system, not individual tasks
- Intervene only on exceptions
- Set strategy, let others execute
- Celebrate team wins

### Coordination
- Keep work flowing between people
- Unblock, coordinate, distribute
- Rate quality, provide feedback
- Hold weekly rhythm

### Execution
- Complete daily work
- Ask for help when blocked
- Hand off cleanly with context
- Reflect weekly

### Guidance
- Observe, don't play
- Ask questions, don't give answers
- Build capability, not dependency
- Surface patterns across clients

## Optional Metaphors

Some organizations find metaphors helpful for explaining these patterns:

**Sports Team**: Goalkeeper (Oversight), Midfield (Coordination),
Attack/Defense (Execution), Coach (Guidance)

**Orchestra**: Conductor (Oversight), Section Leaders (Coordination),
Musicians (Execution), Music Director (Guidance)

Use whatever language resonates with your team - the behaviors matter
more than the labels.
```

### Appendix C: Terminology Mapping

```markdown
# YSELA ↔ KARVIA Terminology

| Concept | KARVIA (Engine) | YSELA (Product) |
|---------|-----------------|-----------------|
| Daily work item | Task | Next Move |
| Weekly focus | Goal | Priority |
| Quarterly target | Objective | Focus / Objective |
| Person | User | Team Member |
| Work completed | status: completed | Done |
| Work stuck | status: blocked | Stuck / Need Help |
| Assessment | Assessment | Mirror / Diagnosis |
| Score | SSI Score | Health Check |

## Usage Guidelines

- KARVIA docs use technical terms (Task, Goal, etc.)
- YSELA docs use behavioral terms (Next Move, Priority, etc.)
- API responses use KARVIA terms
- UI displays YSELA terms (where applicable)
- Coach prompts use YSELA terms
```

### Appendix D: UI Changes Summary

```markdown
# UX Implementation Scope

## What "Zero UI Changes" Means

- UI LABELS stay the same ("Tasks" remains "Tasks")
- No renaming of existing screens
- No restructuring of navigation

## What IS Planned (UX Enhancements)

| ID | Feature | Sprint | Points |
|----|---------|--------|--------|
| UX-001 | FTUE Welcome Flow | 21 | 3 |
| UX-002 | Empty States | 21 | 2 |
| UX-003 | Feature Unlock System | 22 | 3 |
| UX-004 | Contextual Hints | 22 | 2 |
| UX-005 | Toast System | 23 | 2 |
| UX-006 | Celebration Hierarchy | 23 | 2 |
| UX-007 | Personalization Storage | 24 | 2 |
| UX-008 | History/Progress View | 24 | 1 |
| UX-009 | Empty State Library | 25 | 1 |
| UX-010 | UX Audit & Fixes | 25 | 2 |

**Total**: 20 story points across Sprints 21-25

These are ENHANCEMENTS to existing screens, not label changes.
```

---

## Quick Reference

### Session Checklist

```
□ Session 2: KARVIA Audit & Lock (2 hrs)
  □ Audit 4 docs
  □ Fix date
  □ Create lock document

□ Session 3: YSELA T0 Shaping (2-3 hrs)
  □ Decide core identity
  □ Decide GRIT definition
  □ Decide metaphor approach
  □ Decide principles
  □ Record all decisions

□ Session 4: YSELA T0 Finalization (2 hrs)
  □ Create GRIT.md
  □ Create PRINCIPLES.md
  □ Create TERMINOLOGY.md
  □ Update PHILOSOPHY.md
  □ Create T0 baseline

□ Session 5: YSELA T1 Documentation (3 hrs)
  □ Finalize VISION.md
  □ Create 3 user journeys
  □ Review supporting docs
  □ Create T1 baseline
```

### Start Commands

- Session 2: `/init` then "Start KARVIA audit per T1_DOCUMENTATION_REMEDIATION_PLAN.md"
- Session 3: `/strategy` then "Start YSELA T0 shaping discussion per plan"
- Session 4: `/coding` then "Execute YSELA T0 finalization per plan"
- Session 5: `/coding` then "Execute YSELA T1 documentation per plan"

---

**Plan Created**: Session #155 (April 6, 2026)
**Plan Status**: READY FOR EXECUTION
**Next Action**: Start Session 2 (KARVIA Audit) or Session 3 (YSELA Discussion)
