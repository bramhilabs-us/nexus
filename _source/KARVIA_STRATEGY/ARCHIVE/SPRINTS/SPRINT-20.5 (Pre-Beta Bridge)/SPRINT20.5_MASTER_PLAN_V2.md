# Sprint 20.5 - Pre-Beta Documentation Governance

**Version**: 2.0
**Created**: March 30, 2026
**Status**: APPROVED - READY FOR EXECUTION
**Type**: Pre-Beta Bridge Sprint
**Points**: 60
**Duration**: 7 days
**Gate**: Must complete before Sprint 21 (Beta starts Apr 1)

---

## Executive Summary

Sprint 20.5 establishes **zero-ambiguity documentation governance** before Beta launch through:

1. **Document Genome System** - SCSI-inspired identifier scheme for all docs
2. **17 Command Sessions** - SDLC-aligned stakeholder sessions with tiered doc loading
3. **Claude-Driven Registry** - Self-maintaining system with no external scripts
4. **Smart Automation** - Lazy evaluation, incremental updates, minimal compute

**Key Principle**: Claude IS the automation engine. No scripts, no cron jobs, no npm commands.

**Supersedes**: Sprint 16D (marked as superseded)

---

## Table of Contents

1. [Document Genome System](#1-document-genome-system)
2. [17 Command Sessions](#2-17-command-sessions)
3. [Claude-Driven Registry](#3-claude-driven-registry)
4. [Epic Breakdown](#4-epic-breakdown)
5. [Implementation Schedule](#5-implementation-schedule)
6. [Success Criteria](#6-success-criteria)
7. [Files to Create](#7-files-to-create)

---

## 1. Document Genome System

### 1.1 Identifier Format

```
T0-GOV-001-2511
│ │   │   │
│ │   │   └── CREATED: Year-Month (YYMM) - Never changes
│ │   │
│ │   └────── SEQUENCE: 001-999 - Unique within domain
│ │
│ └────────── DOMAIN: 3-char code - Never changes
│
└──────────── TIER: 0-3 - Rarely changes
```

**Properties**:
- Length: 15 characters
- Human-readable
- Immutable (ID never changes after creation)
- Parseable (can extract tier, domain, sequence, date)

### 1.2 Tier Definitions (T0-T3)

| Tier | Name | Governance Level | Change Authority | Examples |
|------|------|------------------|------------------|----------|
| **T0** | Constitutional | Immutable core | Requires approval | CLAUDE.md, DOC_ID_REGISTRY |
| **T1** | Strategic | Business direction | Product owner | PRODUCT_VISION, BETA_ROADMAP |
| **T2** | Canonical | Domain truth | Technical lead | API specs, DESIGN_SYSTEM, Commands |
| **T3** | Working | Sprint-specific | Any contributor | Sprint plans, handoffs, session notes |

### 1.3 Domain Codes

| Code | Domain | Tier Range | Example Docs |
|------|--------|------------|--------------|
| GOV | Governance | T0, T2 | CLAUDE.md, standards, registry |
| PRD | Product | T1, T2 | Vision, roadmap, user stories |
| ARC | Architecture | T2 | System design, API specs |
| SPR | Sprint | T3 | Sprint plans, handoffs |
| TST | Testing | T2, T3 | Test plans, reports |
| OPS | Operations | T2 | Deployment, env config |
| DES | Design | T2 | Mockups, UX principles |
| CMD | Commands | T2 | Slash commands |
| SES | Session | T0, T3 | Session logs, handoffs |

### 1.4 Document Genome Header Template

```markdown
<!--
═══════════════════════════════════════════════════════════════
DOCUMENT GENOME
═══════════════════════════════════════════════════════════════

IDENTIFIER: T[tier]-[domain]-[seq]-[YYMM]

METADATA:
  status: [ACTIVE|DRAFT|REVIEW|DEPRECATED|ARCHIVED]
  updated: [YYYY-MM-DD]
  updated_by: [STAKEHOLDER_CODE]

LINEAGE:
  parent: [PARENT_ID or ROOT]
  depends_on: [list of IDs]

SESSIONS:
  auto: [list of commands that auto-load this doc]
  linked: [list of commands that link to this doc]
  available: [list of commands where this is available]

CHANGELOG:
  - [DATE] | [STAKEHOLDER] | [CHANGE_SUMMARY]

═══════════════════════════════════════════════════════════════
-->
```

### 1.5 Loading Context (Session Access)

| Level | Name | Meaning | Token Cost |
|-------|------|---------|------------|
| **AUTO** | Auto-loaded | Read at session start | Actual tokens |
| **LINKED** | Referenced | Path + summary provided | Zero |
| **AVAILABLE** | On-demand | Can request if needed | Zero until requested |

### 1.6 Stakeholder Codes

| Code | Stakeholder | Type |
|------|-------------|------|
| SAGAR | Sagar (Owner) | Human |
| CLAUDE | Claude AI | AI Session |
| SYSTEM | Automated process | System |
| REVIEW | External reviewer | Human |

---

## 2. 17 Command Sessions

### 2.1 SDLC Alignment

| SDLC Phase | Industry Ceremony | Our Session(s) |
|------------|-------------------|----------------|
| Planning (Strategic) | PI Planning | `/strategy` |
| Planning (Technical) | Sprint Planning | `/sprint-planning` |
| Design | Design Review | `/design` |
| Development | Development Iteration | `/coding` |
| Testing | QA Review | `/testing` |
| Deployment | Release Train | `/deploy` |
| Review | Sprint Review | `/sprint-review` |
| Investigation | Spike, RCA | `/debug`, `/research` |
| Audit | Architecture Review | `/audit`, `/release-audit` |
| Session Management | N/A | `/init`, `/close` |
| Utilities | N/A | `/general`, `/insights`, `/bootstrap`, `/setup` |

### 2.2 Session Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION CATEGORIES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   LIFECYCLE (5)          SUPPORT (6)          ORGANIZATIONAL (6)│
│   ─────────────          ───────────          ──────────────────│
│   /strategy              /audit               /init              │
│   /sprint-planning       /testing             /close             │
│   /coding                /release-audit       /insights          │
│   /design                /debug               /sprint-review     │
│   /deploy                /research            /bootstrap         │
│                          /general             /setup             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Command Detail: `/strategy`

**Session Name**: Executive Planning Room
**SDLC Phase**: Planning (Strategic)
**SAFe Equivalent**: PI Planning, Vision Setting

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Product Owner | Business value | Market context, priorities |
| Solution Architect | Technical vision | System constraints |
| Release Train Engineer | Delivery capacity | Velocity, team capacity |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Project Overview) | T0-GOV-001 | ~500 |
| **AUTO** | Current sprint handoff | T3-SPR-xxx | ~300 |
| **AUTO** | BETA_ROADMAP.md (summary) | T1-PRD-002 | ~400 |
| LINKED | → PRODUCT_VISION.md | T1-PRD-001 | - |
| LINKED | → PRODUCT_STRATEGY_MASTER.md | T1-PRD-003 | - |
| LINKED | → Previous sprint reviews | T3-SPR-xxx | - |
| AVAILABLE | → User stories backlog | T2-PRD-xxx | - |

**AUTO Total**: ~1,200 tokens

#### Exit Criteria
- [ ] Sprint scope defined (epics + points)
- [ ] Business priorities ranked
- [ ] Go/No-Go decision documented

---

### 2.4 Command Detail: `/sprint-planning` (NEW)

**Session Name**: Technical War Room
**SDLC Phase**: Planning (Technical)
**SAFe Equivalent**: Sprint Planning, Iteration Planning

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Lead Architect | System design | Patterns, API contracts |
| Senior Developer | Implementation | Code structure, services |
| Tech Lead | Risk assessment | Tech debt, dependencies |
| QA Lead | Test strategy | Coverage approach |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Architecture, §Key Services, §Data Model) | T0-GOV-001 | ~1,500 |
| **AUTO** | CONTEXT_REGISTRY.md | T2-ARC-001 | ~400 |
| **AUTO** | Sprint master plan | T3-SPR-xxx | ~600 |
| **AUTO** | Technical implementation spec | T3-SPR-xxx | ~800 |
| LINKED | → server/models/*.js paths | - | - |
| LINKED | → server/routes/*.js paths | - | - |
| LINKED | → server/services/*.js paths | - | - |
| LINKED | → Dependency map | T3-SPR-xxx | - |
| AVAILABLE | → Individual model files | - | - |
| AVAILABLE | → Test files | - | - |

**AUTO Total**: ~3,300 tokens

#### Exit Criteria
- [ ] Stories broken into file-level tasks
- [ ] API contracts defined (endpoint, request, response)
- [ ] Dependencies ordered (what blocks what)
- [ ] Risk mitigation per high-risk item
- [ ] Day-by-day execution plan
- [ ] Test strategy per epic

---

### 2.5 Command Detail: `/coding`

**Session Name**: Developer Workbench
**SDLC Phase**: Development

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Developer | Implementation | Feature coding |
| Code Reviewer | Quality | Standards, security |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Technical Concepts, §Security) | T0-GOV-001 | ~1,000 |
| **AUTO** | Current handoff (implementation section) | T3-SPR-xxx | ~300 |
| **AUTO** | Technical spec (current epic) | T3-SPR-xxx | ~500 |
| LINKED | → Relevant model files | - | - |
| LINKED | → Relevant route files | - | - |
| LINKED | → CONTEXT_REGISTRY.md | T2-ARC-001 | - |
| AVAILABLE | → Test patterns | - | - |

**AUTO Total**: ~1,800 tokens

#### Exit Criteria
- [ ] Feature implemented
- [ ] Tests written
- [ ] Code review ready

---

### 2.6 Command Detail: `/design`

**Session Name**: UX Design Studio
**SDLC Phase**: Design

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| UX Designer | User experience | Flows, interactions |
| UI Developer | Component feasibility | Component library |
| Brand Lead | Visual identity | Design tokens |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | DESIGN_SYSTEM.md | T2-DES-001 | ~800 |
| **AUTO** | YSELA_UX_PRINCIPLES.md | T2-DES-002 | ~600 |
| **AUTO** | Feature requirements | T3-SPR-xxx | ~300 |
| LINKED | → Existing mockup paths | - | - |
| LINKED | → Component library | - | - |
| AVAILABLE | → Accessibility guidelines | - | - |

**AUTO Total**: ~1,700 tokens

#### Exit Criteria
- [ ] Mockups created
- [ ] Design decisions documented
- [ ] Component specs defined

---

### 2.7 Command Detail: `/deploy` (NEW)

**Session Name**: Release Deployment Room
**SDLC Phase**: Deployment

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Release Manager | Deployment orchestration | Release checklist |
| DevOps Engineer | Infrastructure | Render, env config |
| QA Lead | Release validation | Smoke tests |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Deployment checklist | T2-OPS-001 | ~400 |
| **AUTO** | Environment config summary | T2-OPS-002 | ~300 |
| **AUTO** | Current release scope | T3-SPR-xxx | ~300 |
| LINKED | → RENDER_ENV_VARS*.md | T2-OPS-xxx | - |
| LINKED | → Rollback procedure | T2-OPS-xxx | - |
| AVAILABLE | → Previous deployment logs | - | - |

**AUTO Total**: ~1,000 tokens

#### Exit Criteria
- [ ] Pre-deployment checks passed
- [ ] Deployment executed
- [ ] Smoke tests verified
- [ ] Rollback ready if needed

---

### 2.8 Command Detail: `/audit`

**Session Name**: Quality Review Board
**SDLC Phase**: Verification

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Security Auditor | Application security | OWASP checklist |
| Architecture Reviewer | Pattern compliance | Standards |
| Code Quality Lead | Best practices | Quality metrics |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Security Patterns) | T0-GOV-001 | ~400 |
| **AUTO** | AUDIT_TRACKER.md | T2-GOV-003 | ~500 |
| **AUTO** | Code/feature to audit | varies | varies |
| LINKED | → OWASP checklist | - | - |
| LINKED | → Previous audit reports | T3-TST-xxx | - |
| AVAILABLE | → Vulnerability guides | - | - |

**AUTO Total**: ~900 + code

#### Exit Criteria
- [ ] Findings documented (P1/P2/P3)
- [ ] Fixes assigned
- [ ] AUDIT_TRACKER updated

---

### 2.9 Command Detail: `/testing`

**Session Name**: QA War Room
**SDLC Phase**: Testing

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| QA Engineer | Test execution | Test methodology |
| Edge Case Specialist | Boundary testing | Edge case library |
| User Advocate | Acceptance testing | User perspective |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Test plan (current sprint) | T3-TST-xxx | ~500 |
| **AUTO** | User stories (acceptance criteria) | T3-SPR-xxx | ~400 |
| **AUTO** | Known issues list | T2-TST-001 | ~300 |
| LINKED | → Test case library | T2-TST-xxx | - |
| LINKED | → Edge case catalog | T2-TST-xxx | - |
| AVAILABLE | → Playwright test files | - | - |

**AUTO Total**: ~1,200 tokens

#### Exit Criteria
- [ ] Test report with pass/fail
- [ ] Bugs logged with severity
- [ ] Release recommendation

---

### 2.10 Command Detail: `/release-audit`

**Session Name**: Release Gate Review
**SDLC Phase**: Release Validation

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Release Manager | Gate keeper | Checklist enforcement |
| Security Officer | Production security | Security sign-off |
| QA Lead | Quality gate | Coverage verification |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Release checklist | T2-OPS-003 | ~400 |
| **AUTO** | Sprint test report | T3-TST-xxx | ~400 |
| **AUTO** | Security audit summary | T3-TST-xxx | ~300 |
| LINKED | → Deployment guide | T2-OPS-001 | - |
| LINKED | → Rollback procedure | T2-OPS-xxx | - |
| AVAILABLE | → Full audit report | T3-TST-xxx | - |

**AUTO Total**: ~1,100 tokens

#### Exit Criteria
- [ ] Release APPROVED or BLOCKED
- [ ] Clear rationale documented
- [ ] Action items if blocked

---

### 2.11 Command Detail: `/debug` (NEW)

**Session Name**: Investigation Room
**SDLC Phase**: Maintenance / Incident Response

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Senior Developer | Code investigation | Deep code knowledge |
| System Analyst | Log analysis | Error patterns |
| Architect | System behavior | Component interactions |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Architecture) | T0-GOV-001 | ~500 |
| **AUTO** | Error context (logs, stack trace) | - | varies |
| **AUTO** | Relevant code file(s) | - | varies |
| LINKED | → Related service files | - | - |
| LINKED | → Database models | - | - |
| LINKED | → Recent git commits | - | - |
| AVAILABLE | → Test files | - | - |

**AUTO Total**: ~500 + context

#### Exit Criteria
- [ ] Root cause identified
- [ ] Fix implemented or proposed
- [ ] Prevention recommendation

---

### 2.12 Command Detail: `/research` (NEW)

**Session Name**: Deep Dive Room
**SDLC Phase**: Analysis / Spike

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Technical Researcher | Technology evaluation | Options analysis |
| Architect | Fit assessment | Integration feasibility |
| Domain Expert | Context | Business requirements |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Research question/topic | - | ~200 |
| **AUTO** | Current architecture summary | T2-ARC-xxx | ~400 |
| LINKED | → Related documentation | - | - |
| LINKED | → External resources (web) | - | - |
| AVAILABLE | → Academic papers | - | - |

**AUTO Total**: ~600 tokens

#### Exit Criteria
- [ ] Research findings documented
- [ ] Options with pros/cons
- [ ] Recommendation with rationale

---

### 2.13 Command Detail: `/general`

**Session Name**: Open Discussion Room
**SDLC Phase**: Any (Ad-hoc)

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Generalist | Flexible | Broad knowledge |
| Quick Responder | Efficiency | Fast resolution |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | CLAUDE.md (§Project Overview) | T0-GOV-001 | ~300 |
| LINKED | → Everything else | - | - |

**AUTO Total**: ~300 tokens (minimal)

#### Exit Criteria
- [ ] Question answered
- [ ] Task completed
- [ ] Escalation path if complex

---

### 2.14 Command Detail: `/init`

**Session Name**: Session Orientation
**Purpose**: Context restoration for new Claude instance

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Continuity Manager | Session history | What happened before |
| Context Loader | State restoration | Where we are now |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | SESSION_LOG.md (last 10 entries) | T0-SES-001 | ~500 |
| **AUTO** | Current sprint handoff | T3-SPR-xxx | ~400 |
| **AUTO** | Session break notes (if exists) | T3-SES-xxx | ~300 |
| LINKED | → Sprint master plan | T3-SPR-xxx | - |
| LINKED | → DOC_ID_REGISTRY.md (header only) | T0-GOV-002 | - |

**AUTO Total**: ~1,200 tokens

#### Registry Health Check (NEW)

```markdown
## Step 0.5: Registry Health

1. Read DOC_ID_REGISTRY.md header
2. Check: last_verified < 7 days?
   - Yes → Proceed
   - No → Flag: "Registry stale"
3. Check: doc_count ≈ actual?
   - Match → Proceed
   - Mismatch > 5% → Flag: "Orphan docs"

Action: Flag only, don't block
```

#### Exit Criteria
- [ ] Context restored
- [ ] Recommended session type
- [ ] Ready to begin work

---

### 2.15 Command Detail: `/close`

**Session Name**: Session Wrap-up
**Purpose**: Preserve context for next Claude instance

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Documentation Lead | Work summary | What was accomplished |
| Handoff Specialist | Context preservation | Restart instructions |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Current session work | - | varies |
| **AUTO** | Handoff template | T2-SES-001 | ~200 |
| LINKED | → SESSION_LOG.md | T0-SES-001 | - |

**AUTO Total**: ~200 + work summary

#### Registry Sync (NEW)

```markdown
## Step 4: Registry Sync

If documents were created/modified:

1. For NEW docs:
   - Verify genome header
   - Add row to registry
   - Update Next Available IDs

2. For MODIFIED docs:
   - Update registry row

3. Update registry header:
   - updated: [today]
   - doc_count: [new count]
```

#### Exit Criteria
- [ ] Handoff updated
- [ ] Session logged
- [ ] Registry synced (if changes)
- [ ] Next session recommended

---

### 2.16 Command Detail: `/sprint-review`

**Session Name**: Retrospective Room
**SDLC Phase**: Review

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Scrum Master | Process facilitation | Ceremony structure |
| Product Owner | Value assessment | Did we deliver value? |
| Team Representative | Execution feedback | What worked/didn't |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Sprint handoff (final) | T3-SPR-xxx | ~500 |
| **AUTO** | Test report summary | T3-TST-xxx | ~300 |
| **AUTO** | Session log (sprint entries) | T0-SES-001 | ~400 |
| LINKED | → Individual epic results | T3-SPR-xxx | - |
| LINKED | → Velocity history | T2-SES-002 | - |

**AUTO Total**: ~1,200 tokens

#### Exit Criteria
- [ ] Sprint review document
- [ ] What worked / What didn't
- [ ] Action items for next sprint

---

### 2.17 Command Detail: `/insights`

**Session Name**: Analytics Review
**SDLC Phase**: Continuous Improvement

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Data Analyst | Metrics interpretation | Trends, patterns |
| Strategic Advisor | Cross-project vision | Big picture |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | PROJECT_INSIGHTS.md | T2-SES-003 | ~600 |
| **AUTO** | Sprint velocity summary | T2-SES-002 | ~300 |
| LINKED | → Full session logs | T0-SES-001 | - |
| LINKED | → Cross-project data | - | - |

**AUTO Total**: ~900 tokens

#### Exit Criteria
- [ ] Insights report
- [ ] Recommendations
- [ ] Trend analysis

---

### 2.18 Command Detail: `/bootstrap`

**Session Name**: New Project Setup
**SDLC Phase**: Inception

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Project Architect | Structure design | Folder layout |
| Standards Lead | Governance | Naming rules |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Project template | T2-GOV-004 | ~400 |
| **AUTO** | Naming conventions | T2-GOV-005 | ~200 |
| LINKED | → Existing project reference | - | - |

**AUTO Total**: ~600 tokens

#### Exit Criteria
- [ ] Project scaffolded
- [ ] Ready for development

---

### 2.19 Command Detail: `/setup`

**Session Name**: Environment Configuration
**SDLC Phase**: Infrastructure

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| DevOps Engineer | Environment config | Dependencies |
| Infrastructure Lead | System setup | Services |

#### Document Tiers

| Level | Document | ID | Tokens |
|-------|----------|-----|--------|
| **AUTO** | Setup guide | T2-OPS-004 | ~500 |
| **AUTO** | Environment requirements | T2-OPS-005 | ~300 |
| LINKED | → Troubleshooting guide | T2-OPS-xxx | - |

**AUTO Total**: ~800 tokens

#### Exit Criteria
- [ ] Environment working
- [ ] Dependencies installed
- [ ] Ready for development

---

### 2.20 Token Budget Summary

| Command | AUTO Tokens | Category |
|---------|-------------|----------|
| `/init` | ~1,200 | Organizational |
| `/close` | ~200 | Organizational |
| `/strategy` | ~1,200 | Lifecycle |
| `/sprint-planning` | ~3,300 | Lifecycle |
| `/coding` | ~1,800 | Lifecycle |
| `/design` | ~1,700 | Lifecycle |
| `/deploy` | ~1,000 | Lifecycle |
| `/audit` | ~900 | Support |
| `/testing` | ~1,200 | Support |
| `/release-audit` | ~1,100 | Support |
| `/debug` | ~500 | Support |
| `/research` | ~600 | Support |
| `/general` | ~300 | Support |
| `/sprint-review` | ~1,200 | Organizational |
| `/insights` | ~900 | Organizational |
| `/bootstrap` | ~600 | Organizational |
| `/setup` | ~800 | Organizational |

**Average AUTO load**: ~1,100 tokens (very efficient)

---

## 3. Claude-Driven Registry

### 3.1 Core Principle

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Claude reads docs anyway → Free verification                  │
│   Claude creates docs anyway → Free registration                │
│   Claude modifies docs anyway → Free update tracking            │
│   Claude runs /close anyway → Free sync point                   │
│                                                                  │
│   NO EXTRA COMPUTE. JUST SMART INTEGRATION.                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Maintenance Triggers

| Trigger | What Happens | Command |
|---------|--------------|---------|
| Session Start | Verify registry freshness | `/init` |
| Doc Created | Assign ID, add to registry | Any session |
| Doc Modified | Update `updated` field | Any session |
| Session End | Commit registry changes | `/close` |
| Explicit Request | Full registry rebuild | `/audit` |

### 3.3 Lazy Evaluation Pattern

```
EVERY SESSION (/init):
• Check registry header timestamp
• If stale (>7 days): flag, don't block
• If orphan count mismatch: flag, don't block

WHEN CREATING DOC:
• Claude assigns next ID in sequence
• Claude adds single line to registry
• No full rebuild needed

WHEN MODIFYING DOC:
• Claude updates `updated` in doc genome
• Claude updates single registry line
• No full rebuild needed

ON REQUEST (/audit or explicit):
• Full registry rebuild
• Orphan detection
• Stale doc detection
• Child computation
```

### 3.4 Tracked Directories

| Directory | Track? | Tier Range |
|-----------|--------|------------|
| `.claude/` | Yes | T0, T2 |
| `KARVIA_STRATEGY/1-PRODUCT/` | Yes | T1, T2 |
| `KARVIA_STRATEGY/2-TECHNICAL/` | Yes | T2 |
| `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/` | Yes | T3 |
| `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/` | Yes | T2, T3 |
| `KARVIA_STRATEGY/GUIDES/` | Yes | T2 |
| `server/` | No | - |
| `client/` | No | - |

**Scope**: ~50-80 documents

---

## 4. Epic Breakdown

### Epic A: Genome System Foundation (6 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| A-1 | 2 | GENOME_SPECIFICATION.md - ID format, tiers, domains |
| A-2 | 2 | GENOME_TEMPLATE.md - Copy-paste header template |
| A-3 | 2 | Maintenance instructions embedded in template |

**Exit Criteria**:
- [ ] ID format documented: `T[0-3]-[DOM]-[SEQ]-[YYMM]`
- [ ] All domain codes defined
- [ ] All stakeholder codes defined
- [ ] Template ready for use

---

### Epic B: Registry Bootstrap (8 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| B-1 | 3 | DOC_ID_REGISTRY.md structure with maintenance instructions |
| B-2 | 3 | Initial population (~30 key docs) |
| B-3 | 2 | Next Available IDs table |

**Exit Criteria**:
- [ ] Registry created with self-maintenance instructions
- [ ] 30+ docs registered
- [ ] Dependency tree computed
- [ ] Next IDs ready for all domains

---

### Epic C: Session Document Matrix (6 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| C-1 | 3 | SESSION_DOC_MATRIX.md - All 17 commands mapped |
| C-2 | 2 | AUTO/LINKED/AVAILABLE for each session |
| C-3 | 1 | Token budget per session documented |

**Exit Criteria**:
- [ ] All 17 commands have doc mappings
- [ ] AUTO docs clearly identified
- [ ] Token budgets calculated

---

### Epic D: Apply Genome to T0-T2 Docs (10 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| D-1 | 2 | T0 docs: CLAUDE.md, DOC_ID_REGISTRY, SESSION_LOG |
| D-2 | 3 | T1 docs: PRODUCT_VISION, BETA_ROADMAP, etc. |
| D-3 | 3 | T2 docs: CONTEXT_REGISTRY, DESIGN_SYSTEM, etc. |
| D-4 | 2 | Headers-only OKR→YSELA updates (4 strategic docs) |

**Exit Criteria**:
- [ ] All T0 docs have genome
- [ ] All T1 docs have genome
- [ ] Key T2 docs have genome
- [ ] Beta context headers added to strategic docs

---

### Epic E: All 17 Commands (26 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| E-1 | 2 | `/init` - Dynamic sprint, registry health check |
| E-2 | 1 | `/close` - Registry sync integration |
| E-3 | 2 | `/strategy` - Stakeholders, AUTO/LINKED/AVAILABLE |
| E-4 | 3 | `/sprint-planning` - **CREATE NEW** |
| E-5 | 2 | `/coding` - Stakeholders, doc tiers |
| E-6 | 1 | `/design` - Update to v2.1 with tiers |
| E-7 | 3 | `/deploy` - **CREATE NEW** |
| E-8 | 1 | `/audit` - Registry rebuild trigger |
| E-9 | 1 | `/testing` - Stakeholders, doc tiers |
| E-10 | 1 | `/release-audit` - Update |
| E-11 | 3 | `/debug` - **CREATE NEW** |
| E-12 | 3 | `/research` - **CREATE NEW** |
| E-13 | 1 | `/general` - Minimal update |
| E-14 | 1 | `/sprint-review` - Update |
| E-15 | 1 | `/insights` - Update |
| E-16 | 0.5 | `/bootstrap` - Update |
| E-17 | 0.5 | `/setup` - Update |

**Exit Criteria**:
- [ ] All 17 commands updated/created
- [ ] All have stakeholder tables
- [ ] All have AUTO/LINKED/AVAILABLE sections
- [ ] No hardcoded sprint references
- [ ] Version headers consistent

---

### Epic F: Legacy & Cleanup (4 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| F-1 | 2 | Inventory `Karvia_OKR_Product_Planning/` dependencies |
| F-2 | 1 | Inventory `Karvia_OKR_Mockups/` dependencies |
| F-3 | 1 | Rename Sprint 16D folder to "(Superseded by 20.5)" |

**Exit Criteria**:
- [ ] Dependency inventories complete
- [ ] Sprint 16D folder renamed
- [ ] Recommendation doc for future merge

---

## 5. Implementation Schedule

| Day | Focus | Points | Deliverables |
|-----|-------|--------|--------------|
| **1** | Epic A | 6 | GENOME_SPECIFICATION, GENOME_TEMPLATE |
| **2** | Epic B | 8 | DOC_ID_REGISTRY with 30+ docs |
| **3** | Epic C + D (T0) | 8 | SESSION_DOC_MATRIX, T0 genomes |
| **4** | Epic D (T1, T2) | 5 | T1/T2 genomes, Beta headers |
| **5** | Epic E (Core) | 12 | /init, /close, /strategy, /sprint-planning, /coding |
| **6** | Epic E (Support) | 10 | /design, /deploy, /audit, /testing, /debug, /research |
| **7** | Epic E (Org) + F | 11 | /general, /sprint-review, /insights, /bootstrap, /setup, Legacy cleanup |

**Total**: 60 points / 7 days

---

## 6. Success Criteria

### Quantitative

| Metric | Target |
|--------|--------|
| Commands with stakeholder tables | 17/17 |
| Commands with AUTO/LINKED/AVAILABLE | 17/17 |
| T0-T2 docs with genome | 100% (~30 docs) |
| Docs in registry | 30+ |
| Hardcoded "Sprint-3" refs | 0 |
| Average AUTO tokens per session | < 2,000 |

### Qualitative

| Criterion | Validation |
|-----------|------------|
| Zero-ambiguity context loading | Each command knows exactly what to read |
| Self-maintaining registry | Claude updates registry during normal work |
| No external scripts | Zero npm/node dependencies for doc management |
| SDLC alignment | Commands map to industry ceremonies |
| Scalable | Adding new docs doesn't increase complexity |

---

## 7. Files to Create

### New Files

| File | Location | Epic |
|------|----------|------|
| GENOME_SPECIFICATION.md | `.claude/` | A |
| GENOME_TEMPLATE.md | `.claude/templates/` | A |
| DOC_ID_REGISTRY.md | `.claude/` | B |
| SESSION_DOC_MATRIX.md | `.claude/` | C |
| sprint-planning.md | `.claude/commands/` | E |
| deploy.md | `.claude/commands/` | E |
| debug.md | `.claude/commands/` | E |
| research.md | `.claude/commands/` | E |

### Files to Update

| File | Change | Epic |
|------|--------|------|
| All existing commands (13) | Add stakeholders, doc tiers | E |
| CLAUDE.md | Add genome header | D |
| PRODUCT_VISION.md | Add genome + Beta context | D |
| BETA_ROADMAP.md | Add genome | D |
| CONTEXT_REGISTRY.md | Add genome | D |
| DESIGN_SYSTEM.md | Add genome | D |
| SESSION_LOG.md | Add genome | D |

### Folder Actions

| Action | Target |
|--------|--------|
| Rename | `SPRINT-16D (On Hold)` → `SPRINT-16D (Superseded by 20.5)` |

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Genome header adds noise | Keep minimal, use HTML comments |
| Registry gets out of sync | Lazy verification, not blocking |
| Too many doc tiers confuse | Clear SESSION_DOC_MATRIX reference |
| Command updates break workflow | Test each command after update |

---

## 9. Post-Sprint Maintenance

After Sprint 20.5, the system is self-maintaining:

1. **New doc created**: Claude assigns ID, adds genome, updates registry
2. **Doc modified**: Claude updates `updated` field
3. **Session starts**: `/init` does lightweight registry check
4. **Session ends**: `/close` syncs any changes
5. **Periodic audit**: `/audit` rebuilds full registry

**No scripts. No cron. Just Claude.**

---

## Appendix A: Quick Reference

### Identifier Format
```
T0-GOV-001-2511
│ │   │   │
│ │   │   └── Created YYMM
│ │   └────── Sequence
│ └────────── Domain
└──────────── Tier
```

### Domain Codes
```
GOV PRD ARC SPR TST OPS DES CMD SES
```

### Loading Levels
```
AUTO     = Read at session start
LINKED   = Path provided, read if needed
AVAILABLE = Exists, request on demand
```

### Stakeholder Codes
```
SAGAR CLAUDE SYSTEM REVIEW
```

---

**Document Owner**: Claude + Sagar
**Created**: March 30, 2026
**Status**: APPROVED - READY FOR EXECUTION
**Next Step**: Begin Day 1 - Epic A
