# SDLC Documentation Gap Analysis

<!-- @GENOME T3-SPR-SDLC-001 | ACTIVE | 2026-04-05 | parent:T0-GOV-001 | auto:- | linked:/strategy,/audit -->

**Version**: 1.0
**Created**: April 5, 2026
**Purpose**: Identify documentation gaps against SDLC best practices for enterprise-grade system
**Status**: ANALYSIS COMPLETE

---

## Executive Summary

This analysis maps our current documentation against SDLC best practices to ensure we have everything needed for:
- Sprint planning at KARVIA engine level
- Sprint planning at YSELA experience level
- Strategic decision-making
- Technical implementation
- Change tracking with genome metadata

---

## Documentation Tier Model

```
┌─────────────────────────────────────────────────────────────────┐
│ T0 - GOVERNANCE (Constitutional)                                │
│ • CLAUDE.md, SESSION_LOG.md, ECOSYSTEM_ARCHITECTURE.md          │
│ • Change Authority: Requires explicit approval                  │
│ • Genome: Required, status tracking critical                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ T1 - STRATEGY (Vision & Direction)                              │
│ • Vision docs, roadmaps, business model                         │
│ • Change Authority: Product owner / CTO                         │
│ • Genome: Required, version tracking critical                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ T2 - CANONICAL (Authoritative References)                       │
│ • Architecture, API specs, data models, design system           │
│ • Change Authority: Technical lead                              │
│ • Genome: Required, dependency tracking                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ T3 - WORKING (Sprint & Operations)                              │
│ • Sprint plans, handoffs, session notes                         │
│ • Change Authority: Any contributor                             │
│ • Genome: Recommended, lightweight tracking                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Gap Analysis by SDLC Phase

### 1. VISION & STRATEGY

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Product Vision | Why we exist, long-term direction | Quarterly |
| Mission Statement | What we do, for whom | Annually |
| Business Model | How we make money | Quarterly |
| Market Analysis | Competition, positioning | Quarterly |
| Roadmap | Timeline of major initiatives | Monthly |

#### Current State - KARVIA Layer

| Required Doc | Current File | Status | Genome? | Gap |
|--------------|--------------|--------|---------|-----|
| Engine Vision | PRODUCT_VISION.md | ⚠️ STALE (Nov 2025) | Yes | Content outdated, wrong scope |
| Engine Capabilities | KARVIA_1.0_CAPABILITIES.md | ✅ Current | Yes | Good baseline |
| Technical Roadmap | roadmap/BETA_RELEASE_PROJECT/ | ✅ Current | Partial | Scattered across files |
| Business Model | GO_TO_MARKET.md | ⚠️ STALE (Nov 2025) | Yes | Needs refresh |
| Market Analysis | market_signals.md | ⚠️ STALE (Oct 2025) | No | No genome tag |

#### Current State - YSELA Layer

| Required Doc | Current File | Status | Genome? | Gap |
|--------------|--------------|--------|---------|-----|
| Product Vision | YSELA/vision/YSELA_VISION.md | 🔄 DRAFT | No | Needs finalization |
| Philosophy | YSELA/philosophy/YSELA_PHILOSOPHY.md | ✅ Current | No | Needs genome |
| UX Principles | YSELA/experience/UX_PRINCIPLES.md | ✅ Current | No | Needs genome |
| Methodology | YSELA/methodology/CONSULTANT_METHODOLOGY.md | ✅ Current | No | Needs genome |
| Experience Journeys | - | ❌ MISSING | - | Need to create |

#### GAPS IDENTIFIED - Vision & Strategy

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| VS-001 | No clear KARVIA_ENGINE_VISION.md | P0 | Create new |
| VS-002 | YSELA_VISION.md incomplete | P0 | Finalize |
| VS-003 | No unified PRODUCT_ROADMAP.md | P1 | Consolidate |
| VS-004 | GO_TO_MARKET.md outdated | P2 | Update |
| VS-005 | YSELA docs missing genome tags | P2 | Add tags |
| VS-006 | No YSELA experience journeys | P1 | Create 3 docs |

---

### 2. PRODUCT REQUIREMENTS

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| PRD (Product Requirements) | Feature specifications | Per feature |
| User Stories | User-centric requirements | Per sprint |
| Acceptance Criteria | Definition of done | Per story |
| Personas | User archetypes | Quarterly |
| Use Cases / Journeys | User flows | Per feature |

#### Current State - KARVIA Layer

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| PRD | MVP_PRD_V3.md | ⚠️ STALE | Yes |
| User Stories | user-stories/USER_STORIES_MASTER.md | ✅ Exists | Yes |
| Personas | personas_and_jtbd.md | ⚠️ STALE (Oct 2025) | No |
| System Flows | system-flows/*.md | ✅ Current | Partial |
| Feature Catalog | FEATURE_CATALOG.md | ⚠️ STALE (Nov 2025) | Yes |

#### Current State - YSELA Layer

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Experience Stories | - | ❌ MISSING | - |
| Experience Journeys | - | ❌ MISSING | - |
| Persona Profiles | - | ❌ MISSING | - |
| Backlog | - | ❌ MISSING | - |

#### GAPS IDENTIFIED - Product Requirements

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| PR-001 | No YSELA_BACKLOG.md | P1 | Split from MASTER |
| PR-002 | No KARVIA_BACKLOG.md | P1 | Split from MASTER |
| PR-003 | No YSELA experience stories | P1 | Create |
| PR-004 | personas_and_jtbd.md no genome | P2 | Add tag |
| PR-005 | FEATURE_CATALOG.md outdated | P2 | Update |

---

### 3. TECHNICAL ARCHITECTURE

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| System Architecture | Overall system design | Major changes |
| API Specification | API contracts | Per API change |
| Data Model | Database schema | Per model change |
| Security Architecture | Security design | Quarterly |
| Infrastructure | Deployment architecture | Per infra change |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| System Architecture | MVP_TECHNICAL_ARCHITECTURE_V5.md | ✅ Current | Yes |
| Backend Architecture | backend_architecture.md | ✅ Exists | No |
| API Contracts | api_contracts.md | ✅ Exists | No |
| API Spec | openapi.yaml | ✅ Current | N/A |
| Data Model | database_schema.md | ✅ Exists | No |
| Security | JWT_SECURITY_DESIGN.md | ✅ Exists | No |
| Multi-tenancy | MULTI_TENANCY_SECURITY.md | ✅ Exists | No |
| RBAC | RBAC_IMPLEMENTATION_GUIDE.md | ✅ Exists | No |
| Permissions | PERMISSION_MATRIX.md | ✅ Exists | No |

#### GAPS IDENTIFIED - Technical Architecture

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| TA-001 | Most 2-TECHNICAL docs lack genome | P2 | Add tags |
| TA-002 | No consolidated SECURITY_ARCHITECTURE.md | P2 | Consolidate |
| TA-003 | No INFRASTRUCTURE_ARCHITECTURE.md | P3 | Create if needed |

**Note**: Technical docs are actually in good shape. Main gap is governance metadata.

---

### 4. DESIGN & UX

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Design System | Visual standards, components | Per design change |
| UX Principles | Design philosophy | Quarterly |
| Mockups | Visual designs | Per feature |
| Style Guide | Typography, colors, spacing | Per brand change |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Design System | .claude/DESIGN_SYSTEM.md | ✅ Current | No |
| UX Principles | YSELA/experience/UX_PRINCIPLES.md | ✅ Current | No |
| Mockups | YSELA/mockups/ | ✅ Current | Partial |
| Coach Persona | YSELA/experience/COACH_PERSONA.md | ✅ Current | No |
| Gamification | YSELA/experience/PBL_GAMIFICATION.md | ✅ Current | No |

#### GAPS IDENTIFIED - Design & UX

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| DX-001 | YSELA experience docs lack genome | P2 | Add tags |
| DX-002 | Design system not in YSELA folder | P3 | Consider moving |

**Note**: Design/UX docs are actually solid. Just need governance metadata.

---

### 5. DEVELOPMENT & SPRINT PLANNING

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Sprint Plan | Sprint goals, stories | Per sprint |
| Sprint Backlog | Prioritized work items | Per sprint |
| Definition of Done | Quality criteria | Quarterly |
| Coding Standards | Code style, patterns | As needed |
| Handoff Document | Session continuity | Per session |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Sprint Plan | SPRINT-21/SPRINT21_MASTER_PLAN.md | ✅ Current | Yes |
| Sprint Handoff | SPRINT21_HANDOFF_DOCUMENT.md | ✅ Current | Yes |
| Dev Standards | .claude/BEST_PRACTICES.md | ✅ Exists | No |
| Code Structure | .claude/CODEBASE_STRUCTURE.md | ✅ Current | No |
| Session Management | .claude/SESSION_LOG.md | ✅ Current | Yes |

#### GAPS IDENTIFIED - Development

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| DV-001 | No separate KARVIA sprint template | P2 | Create |
| DV-002 | No separate YSELA sprint template | P2 | Create |
| DV-003 | Sprint templates not split by layer | P2 | Create dual templates |

---

### 6. QUALITY & TESTING

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Test Strategy | Overall testing approach | Quarterly |
| Test Plan | Sprint-specific tests | Per sprint |
| Test Cases | Detailed test specs | Per feature |
| QA Standards | Quality criteria | Quarterly |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Test Strategy | MASTER_TEST_STRATEGY.md | ✅ Exists | No |
| Test Plan | MASTER_TEST_PLAN_V3.md | ✅ Exists | No |
| BST Tests | TEST_CASES_BST.md | ✅ Exists | No |
| Testing Standards | TESTING_STANDARDS.md | ✅ Exists | No |

#### GAPS IDENTIFIED - Quality & Testing

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| QT-001 | QA docs lack genome tags | P3 | Add tags |
| QT-002 | No YSELA-specific test strategy | P3 | Consider later |

---

### 7. RELEASE & OPERATIONS

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Deployment Guide | How to deploy | Per infra change |
| Release Process | Release workflow | Quarterly |
| Runbook | Operational procedures | Per procedure change |
| Incident Response | How to handle incidents | Quarterly |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Deployment Guide | DEPLOYMENT_GUIDE.md | ✅ Exists | No |
| Deployment Checklist | DEPLOYMENT_CHECKLIST.md | ✅ Exists | No |
| Hotfix Playbook | HOTFIX_PLAYBOOK.md | ✅ Exists | No |
| Environment Config | RENDER_CONFIG.md | ✅ Exists | No |

#### GAPS IDENTIFIED - Release & Operations

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| RO-001 | Ops docs lack genome tags | P3 | Add tags |
| RO-002 | No INCIDENT_RESPONSE.md | P3 | Create if needed |

---

### 8. GOVERNANCE & CHANGE MANAGEMENT

#### What SDLC Best Practices Require

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| Doc Standards | How to write docs | Quarterly |
| Change Log | Track changes | Per change |
| Context Registry | What docs exist | Per doc change |
| Dependency Map | Doc relationships | Per structure change |

#### Current State

| Required Doc | Current File | Status | Genome? |
|--------------|--------------|--------|---------|
| Doc Standards | .claude/DOCUMENT_STANDARDS.md | ✅ Exists | No |
| Context Registry | .claude/CONTEXT_REGISTRY.md | ✅ Current | Yes |
| Session Log | .claude/SESSION_LOG.md | ✅ Current | Yes |
| Templates | .claude/templates/ | ✅ Current | Partial |
| Master Guide | .claude/MASTER_GUIDE.md | ✅ Current | No |

#### GAPS IDENTIFIED - Governance

| Gap ID | Description | Priority | Action |
|--------|-------------|----------|--------|
| GV-001 | Many governance docs lack genome | P2 | Add tags |
| GV-002 | No CHANGE_LOG.md at root | P3 | Consider creating |
| GV-003 | No DOC_DEPENDENCY_MAP.md | P3 | Consider creating |

---

## Summary: Required Documents for Enterprise System

### T0 - Constitutional (Must Have)

| ID | Document | Location | Status |
|----|----------|----------|--------|
| T0-GOV-001 | CLAUDE.md | Root | ✅ EXISTS |
| T0-SES-001 | SESSION_LOG.md | .claude/ | ✅ EXISTS |
| T0-ARC-001 | ECOSYSTEM_ARCHITECTURE.md | Root | ✅ EXISTS |

### T1 - Strategic (Must Have for Sprint Planning)

| ID | Document | Location | Status |
|----|----------|----------|--------|
| T1-KRV-001 | KARVIA_ENGINE_VISION.md | KARVIA_STRATEGY/1-VISION/ | ❌ MISSING |
| T1-YSL-001 | YSELA_PRODUCT_VISION.md | KARVIA_STRATEGY/1-VISION/ | ❌ MISSING |
| T1-YSL-002 | YSELA_VISION.md | YSELA/vision/ | 🔄 DRAFT |
| T1-RDM-001 | PRODUCT_ROADMAP.md | KARVIA_STRATEGY/1-VISION/ | ❌ MISSING (scattered) |
| T1-BIZ-001 | BUSINESS_MODEL.md | KARVIA_STRATEGY/1-VISION/ | ❌ MISSING |
| T1-GTM-001 | GO_TO_MARKET.md | KARVIA_STRATEGY/1-PRODUCT/ | ⚠️ STALE |

### T2 - Canonical (Must Have for Implementation)

| ID | Document | Location | Status |
|----|----------|----------|--------|
| T2-ARC-001 | SYSTEM_ARCHITECTURE.md | 2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ | ✅ EXISTS |
| T2-ARC-002 | API_CONTRACTS.md | 2-TECHNICAL/1-API-SPECIFICATION/ | ✅ EXISTS |
| T2-ARC-003 | DATA_MODELS.md | 2-TECHNICAL/3-DATA/ | ✅ EXISTS |
| T2-PRD-001 | FEATURE_CATALOG.md | 1-PRODUCT/ | ⚠️ STALE |
| T2-PRD-002 | USER_STORIES_MASTER.md | 1-PRODUCT/user-stories/ | ✅ EXISTS |
| T2-PRD-003 | KARVIA_1.0_CAPABILITIES.md | 1-PRODUCT/ | ✅ EXISTS |
| T2-YSL-001 | YSELA_BACKLOG.md | YSELA/backlog/ | ❌ MISSING |
| T2-KRV-001 | KARVIA_BACKLOG.md | 1-PRODUCT/product_backlog/ | ❌ MISSING |
| T2-DES-001 | DESIGN_SYSTEM.md | .claude/ | ✅ EXISTS |
| T2-YSL-002 | UX_PRINCIPLES.md | YSELA/experience/ | ✅ EXISTS |
| T2-YSL-003 | CONSULTANT_METHODOLOGY.md | YSELA/methodology/ | ✅ EXISTS |

### T3 - Working (Required per Sprint)

| ID | Document | Location | Status |
|----|----------|----------|--------|
| T3-SPR-001 | SPRINT_MASTER_PLAN.md | 3-DELIVERY/1-SPRINTS/SPRINT-X/ | ✅ Template exists |
| T3-SPR-002 | SPRINT_HANDOFF_DOCUMENT.md | 3-DELIVERY/1-SPRINTS/SPRINT-X/ | ✅ Template exists |
| T3-SPR-003 | SESSION_BREAK_NOTES.md | 3-DELIVERY/1-SPRINTS/SPRINT-X/ | ✅ Template exists |

---

## Gap Summary Table

### Critical Gaps (P0) - Block Sprint Planning

| Gap ID | Description | Blocks |
|--------|-------------|--------|
| VS-001 | No KARVIA_ENGINE_VISION.md | KARVIA sprint planning |
| VS-002 | YSELA_VISION.md incomplete | YSELA sprint planning |

### High Priority Gaps (P1) - Needed for Effective Planning

| Gap ID | Description | Impact |
|--------|-------------|--------|
| VS-003 | No unified PRODUCT_ROADMAP.md | Timeline confusion |
| VS-006 | No YSELA experience journeys | Can't plan YSELA features |
| PR-001 | No YSELA_BACKLOG.md | Can't prioritize YSELA work |
| PR-002 | No KARVIA_BACKLOG.md | Can't prioritize engine work |

### Medium Priority Gaps (P2) - Governance & Tracking

| Gap ID | Description | Impact |
|--------|-------------|--------|
| VS-004 | GO_TO_MARKET.md outdated | Strategy decisions outdated |
| VS-005 | YSELA docs missing genome | Can't track changes |
| PR-004 | personas_and_jtbd.md no genome | Can't track changes |
| PR-005 | FEATURE_CATALOG.md outdated | Feature status unknown |
| TA-001 | 2-TECHNICAL docs lack genome | Can't track dependencies |
| DX-001 | YSELA experience docs lack genome | Can't track changes |
| DV-001 | No KARVIA sprint template | Inconsistent planning |
| DV-002 | No YSELA sprint template | Inconsistent planning |
| GV-001 | Governance docs lack genome | Can't track meta-changes |

---

## Recommended Document Structure

```
Root/
├── CLAUDE.md                           # T0-GOV-001 ✅
├── ECOSYSTEM_ARCHITECTURE.md           # T0-ARC-001 ✅
│
├── YSELA/                              # YSELA Product Layer
│   ├── vision/
│   │   └── YSELA_VISION.md             # T1-YSL-002 🔄
│   ├── philosophy/
│   │   ├── YSELA_PHILOSOPHY.md         # T2-YSL-PHI-001 ✅
│   │   └── BBB_FRAMEWORK.md            # T2-YSL-PHI-002 ✅
│   ├── experience/
│   │   ├── UX_PRINCIPLES.md            # T2-YSL-UX-001 ✅
│   │   └── USER_JOURNEY_SIMULATION.md  # T2-YSL-UX-002 ✅
│   ├── user-journeys/                  # Experience journeys (MISSING)
│   │   ├── CONSULTANT_EXPERIENCE.md    # T2-YSL-EXP-001 ❌
│   │   ├── BUSINESS_OWNER_EXPERIENCE.md# T2-YSL-EXP-002 ❌
│   │   └── EMPLOYEE_EXPERIENCE.md      # T2-YSL-EXP-003 ❌
│   ├── backlog/
│   │   └── YSELA_BACKLOG.md            # T2-YSL-BKL-001 ❌
│   ├── methodology/
│   │   └── CONSULTANT_METHODOLOGY.md   # T2-YSL-MTD-001 ✅
│   └── mockups/                        # ✅
│
├── KARVIA_STRATEGY/
│   ├── 1-VISION/                       # T1 Strategic (NEW FOLDER)
│   │   ├── KARVIA_ENGINE_VISION.md     # T1-KRV-001 ❌
│   │   ├── YSELA_PRODUCT_VISION.md     # T1-YSL-001 ❌ (link)
│   │   ├── PRODUCT_ROADMAP.md          # T1-RDM-001 ❌
│   │   └── BUSINESS_MODEL.md           # T1-BIZ-001 ❌
│   │
│   ├── 1-PRODUCT/                      # T2 Product (existing)
│   │   ├── KARVIA_1.0_CAPABILITIES.md  # T2-KRV-CAP-001 ✅
│   │   ├── FEATURE_CATALOG.md          # T2-PRD-001 ⚠️
│   │   ├── system-flows/               # T2-PRD-FLOW ✅
│   │   ├── user-stories/               # T2-PRD-STR ✅
│   │   └── product_backlog/
│   │       └── KARVIA_BACKLOG.md       # T2-KRV-BKL-001 ❌
│   │
│   ├── 2-TECHNICAL/                    # T2 Architecture (existing)
│   │   ├── 0-SYSTEM-ARCHITECTURE/      # ✅
│   │   ├── 1-API-SPECIFICATION/        # ✅
│   │   └── 3-DATA/                     # ✅
│   │
│   └── 3-DELIVERY/                     # T3 Working (existing)
│       ├── 1-SPRINTS/SPRINT-21/        # ✅
│       ├── 2-QA-AND-TESTING/           # ✅
│       └── 3-RELEASE-ENGINEERING/      # ✅
│
└── .claude/                            # T0/T2 Governance
    ├── SESSION_LOG.md                  # T0-SES-001 ✅
    ├── CONTEXT_REGISTRY.md             # T2-GOV-001 ✅
    ├── DESIGN_SYSTEM.md                # T2-DES-001 ✅
    └── commands/                       # T2-CMD ✅
```

---

## Action Plan Summary

### Phase 1: Create Missing T1 Docs (Critical for Sprint Planning)

| Task | Create | Est. |
|------|--------|------|
| 1.1 | `1-VISION/KARVIA_ENGINE_VISION.md` | 30 min |
| 1.2 | `1-VISION/YSELA_PRODUCT_VISION.md` (link) | 10 min |
| 1.3 | Finalize `YSELA/vision/YSELA_VISION.md` | 30 min |
| 1.4 | `1-VISION/PRODUCT_ROADMAP.md` (consolidated) | 20 min |

### Phase 2: Create Missing T2 Docs (Critical for Backlog)

| Task | Create | Est. |
|------|--------|------|
| 2.1 | `YSELA/backlog/YSELA_BACKLOG.md` | 20 min |
| 2.2 | `1-PRODUCT/product_backlog/KARVIA_BACKLOG.md` | 15 min |
| 2.3 | `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md` | 20 min |
| 2.4 | `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md` | 20 min |
| 2.5 | `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md` | 20 min |

### Phase 3: Add Genome Tags to Existing Docs

| Task | Files | Est. |
|------|-------|------|
| 3.1 | All YSELA/*.md files | 15 min |
| 3.2 | All 2-TECHNICAL/*.md files | 15 min |
| 3.3 | All .claude/*.md files | 10 min |

### Phase 4: Update Stale Docs

| Task | Update | Est. |
|------|--------|------|
| 4.1 | FEATURE_CATALOG.md | 20 min |
| 4.2 | GO_TO_MARKET.md | 15 min |
| 4.3 | personas_and_jtbd.md | 15 min |

---

## Genome Tag Requirements

### Minimum Required Fields

```markdown
<!-- @GENOME [ID] | [STATUS] | [DATE] | parent:[PARENT] | auto:[COMMANDS] | linked:[COMMANDS] -->
```

### Status Values

| Status | Meaning | When to Use |
|--------|---------|-------------|
| ACTIVE | Current and authoritative | Default for T0/T1/T2 docs |
| DRAFT | Work in progress | New docs being created |
| TRANSITIONING | Being replaced | Docs being superseded |
| ARCHIVED | Historical only | Moved to ARCHIVE |
| DEPRECATED | Do not use | Scheduled for removal |

### ID Naming Convention

```
T[0-3]-[DOMAIN]-[SEQ]

Domains:
- GOV = Governance
- ARC = Architecture
- PRD = Product
- KRV = KARVIA-specific
- YSL = YSELA-specific
- SPR = Sprint/Working
- DES = Design
- OPS = Operations
- TST = Testing
```

---

## Verification Checklist

After completing all phases, verify:

- [ ] Can plan KARVIA engine sprint from docs alone
- [ ] Can plan YSELA experience sprint from docs alone
- [ ] All T1 docs have genome tags
- [ ] All T2 docs have genome tags
- [ ] No circular dependencies in parent chains
- [ ] All docs have clear owner (CTO/CPO)
- [ ] All stale docs marked TRANSITIONING or ARCHIVED

---

**Analysis Complete. Ready to execute action plan.**
