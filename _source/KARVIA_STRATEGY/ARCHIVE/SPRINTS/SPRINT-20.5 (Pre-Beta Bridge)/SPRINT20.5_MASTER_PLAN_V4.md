# Sprint 20.5 - Pre-Beta Documentation Governance (Hardened Edition)

**Version**: 4.0
**Created**: March 30, 2026
**Status**: APPROVED - READY FOR EXECUTION
**Type**: Pre-Beta Bridge Sprint
**Points**: 48
**Duration**: 5 days
**Gate**: Must complete before Sprint 21 (Beta starts Apr 1)

---

## Executive Summary

Sprint 20.5 establishes **zero-ambiguity documentation governance** with **zero extra load** through:

1. **One-Line Genome Tags** - Single line per doc, flexible placement
2. **Computed Registry** - Grep-based, always accurate, no maintenance file
3. **Session Matrix in CONTEXT_REGISTRY** - Single view of doc-command mapping
4. **12 Commands** - Including new /deploy and /quick-fix
5. **9 Hardening Improvements** - Prevents future failure scenarios

**Core Principle**: Information lives where it's used. No separate files that drift.

**Supersedes**: Sprint 16D (folder renamed), Sprint 20.5 V1/V2/V3

---

## What's New in V4

| Addition | Purpose | Points |
|----------|---------|--------|
| Session matrix in CONTEXT_REGISTRY.md | Single source of truth for doc-command mapping | +2 |
| /deploy command | Dedicated deployment execution | +2 |
| /quick-fix command | Post-deployment emergency response | +2 |
| 9 hardening improvements | Prevent failure scenarios | +2 |
| **Total** | | **+8** |

---

## Table of Contents

1. [Zero-Load Philosophy](#1-zero-load-philosophy)
2. [One-Line Genome Tags](#2-one-line-genome-tags)
3. [Computed Registry](#3-computed-registry)
4. [Session Matrix](#4-session-matrix)
5. [12 Commands](#5-12-commands)
6. [Hardening Improvements](#6-hardening-improvements)
7. [Epic Breakdown](#7-epic-breakdown)
8. [Implementation Schedule](#8-implementation-schedule)
9. [Success Criteria](#9-success-criteria)

---

## 1. Zero-Load Philosophy

### What We're NOT Doing

| Rejected Approach | Why Rejected | Load Added |
|-------------------|--------------|------------|
| DOC_ID_REGISTRY.md file | Drifts, needs maintenance | +1 file to sync |
| SESSION_DOC_MATRIX.md file | Drifts, needs maintenance | +1 file to sync |
| GENOME_SPECIFICATION.md | Creates new file to read | +1 file |
| GENOME_TEMPLATE.md | Creates new file to read | +1 file |
| 50-line genome headers | Noise, ignored by Claude | +50 lines/doc |

### What We ARE Doing

| Zero-Load Approach | How It Works | Load Added |
|--------------------|--------------|------------|
| One-line genome tags | Single comment line per doc | +1 line/doc |
| Computed registry | `grep "@GENOME"` on demand | 0 files |
| Session matrix section | Added to existing CONTEXT_REGISTRY.md | +50 lines in existing file |
| Commands self-document | Doc lists IN command files | 0 files |
| Governance in CLAUDE.md | Add section to existing doc | +80 lines total |

### The Math

| Metric | Traditional | Zero-Load | Savings |
|--------|-------------|-----------|---------|
| New files | 4 | 0 | 4 files |
| Lines per doc | 50 | 1 | 98% |
| Maintenance burden | 2 files to sync | 0 | 100% |
| Drift risk | High | Zero | - |

---

## 2. One-Line Genome Tags

### Format

```markdown
<!-- @GENOME [ID] | [STATUS] | [UPDATED] | parent:[PARENT] | auto:[COMMANDS] | linked:[COMMANDS] -->
```

### Example

```markdown
<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding,/strategy | linked:/design -->
```

### Fields

| Field | Format | Purpose | Example |
|-------|--------|---------|---------|
| ID | `T[0-3]-[DOM]-[SEQ]-[YYMM]` | Unique identifier | `T2-ARC-001-2603` |
| Status | `ACTIVE\|DRAFT\|ARCHIVED` | Lifecycle state | `ACTIVE` |
| Updated | `YYYY-MM-DD` | Last modified | `2026-03-30` |
| Parent | `parent:[ID\|ROOT]` | Hierarchy | `parent:T0-GOV-001` |
| Auto | `auto:[commands]` | Commands that auto-load | `auto:/coding,/strategy` |
| Linked | `linked:[commands]` | Commands that link | `linked:/design` |

### Tier Definitions

| Tier | Name | Change Authority | Examples |
|------|------|------------------|----------|
| T0 | Constitutional | Requires approval | CLAUDE.md, SESSION_LOG |
| T1 | Strategic | Product owner | PRODUCT_VISION, ROADMAP |
| T2 | Canonical | Technical lead | CONTEXT_REGISTRY, DESIGN_SYSTEM |
| T3 | Working | Any contributor | Sprint docs, handoffs |

### Domain Codes

| Code | Domain | Typical Tier |
|------|--------|--------------|
| GOV | Governance | T0, T2 |
| PRD | Product | T1, T2 |
| ARC | Architecture | T2 |
| SPR | Sprint | T3 |
| TST | Testing | T2, T3 |
| OPS | Operations | T2 |
| DES | Design | T2 |
| CMD | Commands | T2 |
| SES | Session | T0, T3 |

### Placement (UPDATED - Flexible)

Tag goes **within first 10 lines**, after the title block:

```markdown
# Document Title

<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/design -->

Document content begins here...
```

**Valid positions**:
- Line 3 (standard - title + blank line + tag)
- Line 5+ (if YAML frontmatter present)
- After badges/shields

**Detection**: `head -10 [file] | grep "@GENOME"`

---

## 3. Computed Registry

### No Maintained File

Instead of a registry file that drifts, compute on demand:

```bash
# Generate full registry
grep -r "@GENOME" --include="*.md" .claude/ KARVIA_STRATEGY/

# Output:
# ./CLAUDE.md:<!-- @GENOME T0-GOV-001 | ACTIVE | 2026-03-30 | parent:ROOT | auto:/init,/coding,/strategy -->
# ./CONTEXT_REGISTRY.md:<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-03-06 | parent:T0-GOV-001 | auto:/coding -->
# ...
```

### Governed Directories (NEW)

Only these directories are genome-tracked:

| Directory | Contents | Tracking |
|-----------|----------|----------|
| `.claude/` | Session management, commands | REQUIRED |
| `KARVIA_STRATEGY/1-PRODUCT/` | Product strategy | REQUIRED |
| `KARVIA_STRATEGY/2-TECHNICAL/` | Architecture docs | REQUIRED |
| `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-*/` | Active sprints | REQUIRED |
| `KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/` | Deployment docs | REQUIRED |

**Excluded** (not tracked - no orphan warnings):

| Directory | Reason |
|-----------|--------|
| `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*Complete*/` | Archived sprints |
| `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*Superseded*/` | Replaced sprints |
| `Karvia_OKR_Product_Planning/` | Legacy (pending migration) |
| `Karvia_OKR_Mockups/` | Legacy |
| `node_modules/`, `.git/` | System |

### Common Queries

| Need | Command |
|------|---------|
| All governed docs | `grep -r "@GENOME" --include="*.md"` |
| Find children of T0-GOV-001 | `grep -r "parent:T0-GOV-001" --include="*.md"` |
| Find docs for /coding | `grep -r "auto:.*coding" --include="*.md"` |
| Find stale docs | `grep -r "@GENOME.*2025-" --include="*.md"` |
| Find archived docs | `grep -r "ARCHIVED" --include="*.md" \| grep "@GENOME"` |
| Count orphans | Compare governed dirs .md count with @GENOME count |

### Performance Thresholds (NEW)

| File Count | Grep Time | Action |
|------------|-----------|--------|
| <1,000 | <2s | Current approach works |
| 1,000-3,000 | 2-5s | Consider caching in /init |
| >3,000 | >5s | Evaluate indexed solution |

**Current count**: ~600 .md files (healthy)

---

## 4. Session Matrix

### Location

Session matrix lives in **CONTEXT_REGISTRY.md** (existing file) as a new section.

**Why here**:
- CONTEXT_REGISTRY's purpose is context lookup
- No new file created
- Single authoritative source
- Commands embed their own lists (derived from matrix)

### Matrix Format

```markdown
## Session-Document Matrix

Legend: A = AUTO, L = LINKED, - = Not loaded

| Document | ID | init | close | strategy | coding | design | audit | testing | release | deploy | quick-fix | general | review |
|----------|-----|------|-------|----------|--------|--------|-------|---------|---------|--------|-----------|---------|--------|
| CLAUDE.md | T0-GOV-001 | A | - | A | A | - | A | - | - | - | A | A | - |
| SESSION_LOG | T0-SES-001 | A | A | - | - | - | - | - | - | - | - | - | A |
| CONTEXT_REGISTRY | T2-ARC-001 | L | - | A | A | - | - | - | - | - | - | - | - |
| DESIGN_SYSTEM | T2-DES-001 | - | - | - | - | A | - | - | - | - | - | - | - |
| Current handoff | T3-SPR-xxx | A | L | A | A | - | - | A | A | A | A | - | A |
| DEPLOYMENT_GUIDE | T2-OPS-003 | - | - | - | - | - | - | - | A | A | L | - | - |
| HOTFIX_PLAYBOOK | T2-OPS-005 | - | - | - | - | - | - | - | - | L | A | - | - |
```

### Bidirectional Sync

Matrix is **source of truth**. Commands embed their lists derived from matrix.

**Sync check**:
```bash
# Matrix says CLAUDE.md is AUTO for /coding
# /coding command should list CLAUDE.md in AUTO
# Verify both match
```

---

## 5. 12 Commands

### Command List

| # | Command | Purpose | Aliases |
|---|---------|---------|---------|
| 1 | /init | Session orientation | - |
| 2 | /close | Session wrap-up | - |
| 3 | /strategy | Executive planning | /sprint-planning, /plan |
| 4 | /coding | Development | - |
| 5 | /design | UX/UI design | - |
| 6 | /audit | Quality review | - |
| 7 | /testing | QA validation | - |
| 8 | /release-audit | Release gate | - |
| 9 | /deploy | Deployment execution | - |
| 10 | /quick-fix | Emergency hotfix | /hotfix |
| 11 | /general | Ad-hoc tasks | /debug, /research |
| 12 | /sprint-review | Retrospective | /retro |

### Token Budgets (NEW)

| Level | Soft Limit | Hard Limit | Action if Exceeded |
|-------|------------|------------|-------------------|
| AUTO | 3,000 | 5,000 | Move lowest-priority to LINKED |
| AUTO + LINKED | 6,000 | 10,000 | Suggest /general instead |

### Command Structure Template

Each command follows this structure:

```markdown
# /[command] Session

**Aliases**: [list if any]
**Version**: 2.0.0
**Last Updated**: [DATE]
**Session Type**: [TYPE]
**Token Budget**: ~[N] AUTO

<!-- @GENOME T2-CMD-xxx | ACTIVE | [DATE] | parent:T0-GOV-001 | auto:/init -->

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| [Role] | [Skills] | [Context] |

---

## Document Context

### AUTO (Read at session start) - ~[N] tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| [Doc] | [ID] | ~[N] | [Sections] |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| [Doc] | [ID] | [Path] |

### AVAILABLE (Exists, request on demand)

- [Doc category]

---

## Session Workflow

[Session-specific steps]

---

## Exit Criteria

- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*[command]" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.
```

---

### 5.1 /init - Session Orientation

**Aliases**: None
**Purpose**: Restore context for new Claude instance
**Token Budget**: ~1,200 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Continuity Manager | Session history | Previous context |
| Context Loader | State restoration | Current position |

#### Document Context

**AUTO** (~1,200 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| SESSION_LOG.md | T0-SES-001 | ~500 | Last 10 entries |
| Current sprint handoff | T3-SPR-xxx | ~400 | Full doc |
| Session break notes | T3-SES-xxx | ~300 | If exists |

**LINKED**:

| Doc | Path |
|-----|------|
| Sprint master plan | Via handoff reference |
| CONTEXT_TIERS section | CLAUDE.md §Document Governance |

#### Health Checks (ENHANCED)

```markdown
## Step 0.5: Health Check (30 seconds)

### 1. Orphan Detection
- Governed dirs only: .claude/, KARVIA_STRATEGY/1-PRODUCT/, etc.
- Count .md files: `find [governed-dirs] -name "*.md" | wc -l`
- Count genome tags: `grep -r "@GENOME" [governed-dirs] | wc -l`
- If tags < 80% of files → Flag: "Orphan docs detected in governed directories"

### 2. Stale Detection
- Find old: `grep "@GENOME.*2025-" --include="*.md"`
- If > 5 found → Flag: "Stale docs detected"

### 3. Status-Loading Validation (NEW)
- Check if any AUTO doc has status: ARCHIVED
- Check if any AUTO doc has status: DRAFT
- If found → Flag: "WARNING: [command] loads ARCHIVED/DRAFT doc [ID]"

### 4. Token Budget Check (NEW)
- Sum AUTO tokens for recommended session type
- If > 4,000 → Flag: "WARNING: AUTO exceeds token budget"

### 5. Action
- Flag only, don't block
- Suggest /audit if critical issues
```

#### Exit Criteria

- [ ] Context restored
- [ ] Current sprint identified
- [ ] Session type recommended
- [ ] Health flags reported (if any)

---

### 5.2 /close - Session Wrap-up

**Aliases**: None
**Purpose**: Preserve context for next Claude instance
**Token Budget**: ~200 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Documentation Lead | Work summary | Session accomplishments |
| Handoff Specialist | Context preservation | Restart instructions |

#### Document Context

**AUTO** (~200 tokens):

| Doc | Tokens | Purpose |
|-----|--------|---------|
| Handoff template | ~200 | Update structure |

**LINKED**:

| Doc | Path |
|-----|------|
| SESSION_LOG.md | .claude/SESSION_LOG.md |
| Current handoff | Via /init reference |

#### Genome Maintenance

```markdown
## Step 4: Genome Sync

If documents were created this session:
1. Verify genome tag exists (within first 10 lines)
2. Verify format matches: <!-- @GENOME ... -->
3. Verify auto/linked fields include relevant commands
4. Suggest next sequence ID: "Next available: T2-ARC-008, T2-DES-004"

If documents were modified:
1. Update `updated` date in genome tag
2. Format: YYYY-MM-DD
```

#### Quick Bidirectional Check (NEW)

```markdown
## Step 5: Quick Sync Check

For each doc modified this session:
1. Read its auto: field
2. Verify each listed command's AUTO includes this doc
3. If mismatch:
   - Flag: "SYNC: Doc X says auto:/coding but /coding doesn't list it"
   - Fix now or defer to /audit
```

#### Exit Criteria

- [ ] Handoff updated with session summary
- [ ] SESSION_LOG.md entry added
- [ ] New docs have genome tags
- [ ] Modified docs have updated dates
- [ ] Bidirectional check passed (or flagged)
- [ ] Next sequence IDs suggested
- [ ] Next session recommended

---

### 5.3 /strategy - Executive Planning Room

**Aliases**: /sprint-planning, /plan
**Purpose**: Strategic decisions, sprint planning, architecture choices
**Token Budget**: ~2,500 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Product Owner | Business value | Market context, priorities |
| Solution Architect | Technical vision | System constraints |
| Delivery Lead | Capacity | Velocity, team capacity |
| Tech Lead | Implementation | Code patterns, risks |

#### Document Context

**AUTO** (~2,500 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~1,000 | §Project Overview, §Architecture |
| Current sprint handoff | T3-SPR-xxx | ~400 | Full doc |
| BETA_ROADMAP.md | T1-PRD-002 | ~600 | Sprint structure |
| CONTEXT_REGISTRY.md | T2-ARC-001 | ~500 | If technical planning |

**LINKED**:

| Doc | Path |
|-----|------|
| PRODUCT_VISION.md | KARVIA_STRATEGY/1-PRODUCT/ |
| Previous sprint reviews | KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/ |
| Technical specs | Current sprint folder |
| server/models/*.js | For technical planning |
| server/routes/*.js | For technical planning |

**AVAILABLE**:
- User stories backlog
- Competitive analysis
- Previous sprint master plans

#### Session Modes

**Mode A: Strategic Planning**
- Focus on WHAT to build
- Scope, priorities, business value
- AUTO: CLAUDE.md, Roadmap, Handoff

**Mode B: Technical Planning** (formerly /sprint-planning)
- Focus on HOW to build
- File breakdown, API contracts, dependencies
- AUTO adds: CONTEXT_REGISTRY.md, Technical spec

#### Exit Criteria

- [ ] Sprint scope defined OR
- [ ] Epic breakdown complete OR
- [ ] Architecture decision documented
- [ ] Next steps clear

---

### 5.4 /coding - Developer Workbench

**Aliases**: None
**Purpose**: Feature implementation, bug fixes
**Token Budget**: ~1,800 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Developer | Implementation | Feature coding |
| Code Reviewer | Quality | Standards, security |

#### Document Context

**AUTO** (~1,800 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~1,000 | §Technical Concepts, §Security Patterns |
| Current handoff | T3-SPR-xxx | ~300 | Implementation section |
| Technical spec | T3-SPR-xxx | ~500 | Current epic |

**LINKED**:

| Doc | Path |
|-----|------|
| CONTEXT_REGISTRY.md | .claude/CONTEXT_REGISTRY.md |
| Relevant models | server/models/*.js |
| Relevant routes | server/routes/*.js |
| Relevant services | server/services/*.js |

**AVAILABLE**:
- Test patterns
- Previous implementations
- API documentation

#### Exit Criteria

- [ ] Feature implemented
- [ ] Tests written
- [ ] No security vulnerabilities
- [ ] Code review ready

---

### 5.5 /design - UX Design Studio

**Aliases**: None
**Purpose**: Mockups, design system, user experience
**Token Budget**: ~1,700 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| UX Designer | User experience | Flows, interactions |
| UI Developer | Implementation | Component feasibility |
| Brand Lead | Visual identity | Design tokens |

#### Document Context

**AUTO** (~1,700 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| DESIGN_SYSTEM.md | T2-DES-001 | ~800 | Full doc |
| YSELA_UX_PRINCIPLES.md | T2-DES-002 | ~600 | GRIT-UX framework |
| Feature requirements | T3-SPR-xxx | ~300 | Current feature |

**LINKED**:

| Doc | Path |
|-----|------|
| Existing mockups | KARVIA_STRATEGY/1-PRODUCT/mockups/ |
| Component library | client/css/, client/js/ |
| User journey maps | KARVIA_STRATEGY/1-PRODUCT/user-journeys/ |

**AVAILABLE**:
- Accessibility guidelines
- Competitor screenshots
- Previous design decisions

#### Exit Criteria

- [ ] Mockups created
- [ ] Design decisions documented
- [ ] Component specs defined
- [ ] Follows GRIT-UX principles

---

### 5.6 /audit - Quality Review Board

**Aliases**: None
**Purpose**: Code quality, security, architecture compliance, governance health
**Token Budget**: ~900 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Security Auditor | Application security | OWASP checklist |
| Architecture Reviewer | Pattern compliance | Standards |
| Governance Lead | Doc health | Registry validation |

#### Document Context

**AUTO** (~900 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~400 | §Security Patterns |
| AUDIT_TRACKER.md | T2-GOV-003 | ~500 | Known issues |

**LINKED**:

| Doc | Path |
|-----|------|
| Code to audit | As specified |
| Previous audit reports | KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/ |
| OWASP checklist | Web reference |

#### Governance Audit Mode (ENHANCED)

```markdown
## Full Governance Scan

When requested, perform deep validation:

### 1. Orphan Detection
```bash
# Find .md files without genome tags in governed dirs
find .claude KARVIA_STRATEGY/1-PRODUCT KARVIA_STRATEGY/2-TECHNICAL -name "*.md" -exec grep -L "@GENOME" {} \;
```

### 2. Stale Detection
```bash
# Find docs not updated in 90+ days
grep -r "@GENOME" --include="*.md" | grep "2025-"
```

### 3. Parent Validation (NEW)
```bash
# Extract all parent references
grep -r "parent:" --include="*.md" | grep -v "parent:ROOT"
# For each parent ID, verify it exists
```

### 4. Status-Loading Check (NEW)
- Find ARCHIVED docs that appear in any command's AUTO list
- Find DRAFT docs that appear in any command's AUTO list (should only be LINKED)
- Flag mismatches

### 5. Bidirectional Check
```bash
# For each command, verify docs match
grep "auto:.*coding" --include="*.md"
# Compare with /coding command's AUTO list
```

### 6. Token Budget Audit (NEW)
- Sum AUTO tokens for each command
- Flag any command exceeding 5,000 tokens

### 7. Report
- List findings by severity (P1/P2/P3)
- Suggest fixes
```

#### Exit Criteria

- [ ] Findings documented (P1/P2/P3)
- [ ] Security issues flagged
- [ ] Governance health reported
- [ ] Parent validation passed
- [ ] Status-loading check passed
- [ ] Token budgets verified
- [ ] Fixes assigned

---

### 5.7 /testing - QA War Room

**Aliases**: None
**Purpose**: Feature validation, bug detection, quality assurance
**Token Budget**: ~1,200 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| QA Engineer | Test methodology | Test plans |
| Edge Case Specialist | Boundary testing | Edge cases |
| User Advocate | Acceptance | User perspective |

#### Document Context

**AUTO** (~1,200 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Test plan | T3-TST-xxx | ~500 | Current sprint |
| User stories | T3-SPR-xxx | ~400 | Acceptance criteria |
| Known issues | T2-TST-001 | ~300 | Current list |

**LINKED**:

| Doc | Path |
|-----|------|
| Test case library | KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/ |
| Edge case catalog | Same location |
| Playwright tests | tests/e2e/ |

**AVAILABLE**:
- Previous test reports
- Bug database
- Performance benchmarks

#### Exit Criteria

- [ ] Test report with pass/fail
- [ ] Bugs logged with severity
- [ ] Release recommendation
- [ ] Edge cases covered

---

### 5.8 /release-audit - Release Gate Review

**Aliases**: None
**Purpose**: Final checks before deployment - GO/NO-GO decision
**Token Budget**: ~1,400 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Release Manager | Gate keeping | Release checklist |
| Security Officer | Production security | Sign-off |
| QA Lead | Quality gate | Coverage report |

#### Document Context

**AUTO** (~1,400 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Release checklist | T2-OPS-001 | ~400 | Gate criteria |
| Sprint test report | T3-TST-xxx | ~400 | Quality evidence |
| Security audit summary | T3-TST-xxx | ~300 | Security status |
| Environment config | T2-OPS-002 | ~300 | Deployment settings |

**LINKED**:

| Doc | Path |
|-----|------|
| DEPLOYMENT_GUIDE.md | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| Rollback procedure | Same location |
| Render env vars | Same location |

**AVAILABLE**:
- Full audit report
- Previous deployment logs
- Incident response playbook

#### Exit Criteria

- [ ] All gate criteria met OR blockers documented
- [ ] Release APPROVED or BLOCKED with rationale
- [ ] If APPROVED, ready for /deploy

---

### 5.9 /deploy - Deployment Execution (NEW)

**Aliases**: None
**Purpose**: Execute deployment to target environment
**Token Budget**: ~1,200 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| DevOps Engineer | Deployment | Commands, procedures |
| SRE | Reliability | Health checks |
| Release Manager | Oversight | Approval confirmation |

#### Document Context

**AUTO** (~1,200 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| DEPLOYMENT_GUIDE.md | T2-OPS-003 | ~500 | Full procedures |
| RENDER_CONFIG.md | T2-OPS-004 | ~400 | Environment vars, URLs |
| Release approval | T3-SPR-xxx | ~300 | From /release-audit |

**LINKED**:

| Doc | Path |
|-----|------|
| Rollback procedure | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| Health check endpoints | API documentation |
| HOTFIX_PLAYBOOK.md | Same location |

#### Environment Matrix

| Environment | Render Service | Branch | URL |
|-------------|---------------|--------|-----|
| Development | karvia-business-1 | development | karvia-business-1.onrender.com |
| Pre-prod | karvia-business-2 | pre-prod | karvia-business-2.onrender.com |
| Production | karvia-business | production | karvia-business.onrender.com |

#### Deployment Workflow

```markdown
## Deployment Steps

### 1. Pre-Deploy Verification
- [ ] /release-audit completed and APPROVED
- [ ] Target environment confirmed: [DEV|PRE-PROD|PROD]
- [ ] Rollback plan confirmed

### 2. Branch Operations
```bash
# Merge to target branch
git checkout [target-branch]
git merge [source-branch] --no-ff
git push origin [target-branch]
```

### 3. Deployment Execution
- Render auto-deploys on push
- Monitor deploy logs in Render dashboard
- Wait for "Live" status

### 4. Post-Deploy Validation
- [ ] Health check: `curl https://[url]/api/health`
- [ ] Smoke test: Core user flows work
- [ ] Error monitoring: No new errors in logs

### 5. Rollback (if needed)
```bash
git revert HEAD
git push origin [target-branch]
```

### 6. Documentation
- [ ] Update deployment log
- [ ] Note any issues in SESSION_LOG
```

#### Exit Criteria

- [ ] Deployment completed successfully
- [ ] Health checks passing
- [ ] Smoke tests passed
- [ ] Rollback plan confirmed (if issues arise)
- [ ] Deployment logged

---

### 5.10 /quick-fix - Emergency Hotfix (NEW)

**Aliases**: /hotfix
**Purpose**: Rapid response to production issues
**Token Budget**: ~800 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| On-call Developer | Rapid diagnosis | Quick fixes |
| SRE | Production access | Logs, metrics |
| QA (lightweight) | Targeted testing | Regression check |

#### Document Context

**AUTO** (~800 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~300 | §Security Patterns only |
| HOTFIX_PLAYBOOK.md | T2-OPS-005 | ~300 | Quick-fix protocol |
| Last deployment record | T3-OPS-xxx | ~200 | What's in prod |

**LINKED**:

| Doc | Path |
|-----|------|
| Full test plan | Current sprint folder |
| Rollback procedure | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| DEPLOYMENT_GUIDE.md | Same location |
| Recent commits | `git log --oneline -20` |

**AVAILABLE**:
- Error logs (from user or monitoring)
- Full codebase
- Previous hotfix records

#### Quick-Fix Protocol

```markdown
## Emergency Response Workflow

### 1. IDENTIFY (5 min max)
- What's broken?
- Severity: P0 (down) / P1 (degraded) / P2 (annoying)
- Affected users: All / Some / Few
- When did it start? (correlate with last deploy)

### 2. ISOLATE (10 min max)
- Which file(s)?
- Which function(s)?
- Root cause hypothesis

### 3. FIX (minimal change only)
- NO refactoring
- NO "while we're here" improvements
- ONLY fix the bug
- Add regression test

### 4. TEST (targeted only)
- Run tests for affected area only
- Manual smoke test of fix
- Verify no new regressions

### 5. DEPLOY (expedited path)
- If P0: Direct to production (with approval)
- If P1/P2: Pre-prod → quick validation → production

### 6. VERIFY
- Confirm fix in production
- Monitor for 15 minutes
- Check error rates

### 7. DOCUMENT
- Log in SESSION_LOG
- Create follow-up ticket (if deeper work needed)
- Update handoff
```

#### Exit Criteria

- [ ] Root cause identified
- [ ] Minimal fix applied
- [ ] Targeted tests pass
- [ ] Fix deployed to affected environment
- [ ] Issue verified resolved
- [ ] Follow-up ticket created (if deeper work needed)
- [ ] Incident logged

---

### 5.11 /general - Open Discussion Room

**Aliases**: /debug, /research
**Purpose**: Quick tasks, research, debugging
**Token Budget**: ~300 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Generalist | Flexible | Broad knowledge |
| Researcher | Investigation | Search skills |
| Debugger | Problem solving | Analytical approach |

#### Document Context

**AUTO** (~300 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~300 | §Project Overview only |

**LINKED**:

| Doc | Path |
|-----|------|
| Everything | On demand |

**AVAILABLE**:
- Full codebase
- All documentation
- Web search

#### Session Modes

**Mode A: Quick Question**
- Minimal context
- Fast answer

**Mode B: Research** (formerly /research)
- Technology evaluation
- Options analysis
- Recommendation

**Mode C: Debug** (formerly /debug)
- Error investigation
- Root cause analysis
- Fix proposal

#### Exit Criteria

- [ ] Question answered OR
- [ ] Research documented OR
- [ ] Bug root cause found
- [ ] Escalation path if complex (suggest /coding or /quick-fix)

---

### 5.12 /sprint-review - Retrospective Room

**Aliases**: /retro
**Purpose**: Sprint retrospective, learnings capture
**Token Budget**: ~1,200 AUTO

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Scrum Master | Process facilitation | Ceremony structure |
| Product Owner | Value assessment | Delivery validation |
| Team Representative | Execution feedback | What worked/didn't |

#### Document Context

**AUTO** (~1,200 tokens):

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Sprint handoff (final) | T3-SPR-xxx | ~500 | Full doc |
| Test report summary | T3-TST-xxx | ~300 | Quality metrics |
| Session log (sprint) | T0-SES-001 | ~400 | Sprint entries |

**LINKED**:

| Doc | Path |
|-----|------|
| Individual epic results | Sprint folder |
| Velocity history | Previous sprint reviews |

**AVAILABLE**:
- Detailed test reports
- Individual session notes
- Stakeholder feedback

#### Exit Criteria

- [ ] Sprint review document created
- [ ] What worked / What didn't captured
- [ ] Action items for next sprint
- [ ] Velocity recorded
- [ ] Sprint folder marked "(Complete)"

---

## 6. Hardening Improvements

### Summary

| # | Improvement | Location | Prevents |
|---|-------------|----------|----------|
| 1 | Flexible tag placement | §2 Genome Tags | Frontmatter breaking tag detection |
| 2 | Governed directories list | §3 Registry | Orphan noise from scratch files |
| 3 | Status-loading validation | /init, /audit | ARCHIVED/DRAFT in AUTO |
| 4 | Parent existence check | /audit | Broken hierarchy references |
| 5 | Command aliases | Each command, CLAUDE.md | Lost discoverability |
| 6 | Token budget tracking | Each command, /init | Context overflow |
| 7 | Quick sync in /close | /close | Drift between audits |
| 8 | Sequence suggestion | /close | ID collisions |
| 9 | Scale threshold | §3 Registry | Future performance issues |

### Implementation Notes

All 9 improvements are **embedded in existing structures**:
- No new files created
- Improvements are sections/fields in existing commands or CLAUDE.md
- Total added: ~75 lines across all locations

---

## 7. Epic Breakdown

### Epic A: Governance Section in CLAUDE.md (4 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| A-1 | 2 | Add §Document Governance section |
| A-2 | 1 | Include genome format, tier definitions, domain codes |
| A-3 | 1 | Add governed directories list, aliases reference, token budgets |

**Exit Criteria**:
- [ ] Section added to CLAUDE.md (~100 lines)
- [ ] Format documented with examples
- [ ] Governed directories defined
- [ ] Aliases quick reference included

---

### Epic B: Session Matrix in CONTEXT_REGISTRY (2 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| B-1 | 2 | Add session-document matrix section to CONTEXT_REGISTRY.md |

**Matrix includes**:
- All 12 commands as columns
- All key docs as rows
- A/L/- notation
- Update instructions

**Exit Criteria**:
- [ ] Matrix section added
- [ ] All 12 commands represented
- [ ] Core docs mapped
- [ ] Sync instructions documented

---

### Epic C: Apply Genome Tags (10 pts)

| Story | Points | Docs | Count |
|-------|--------|------|-------|
| C-1 | 2 | T0 docs | 3 |
| C-2 | 3 | T1 docs | 5 |
| C-3 | 3 | T2 docs | 12 |
| C-4 | 2 | Commands (T2-CMD) | 12 |

**Exit Criteria**:
- [ ] All 32 docs have genome tags
- [ ] Tags follow format exactly
- [ ] Parent references valid
- [ ] Auto/linked fields accurate

---

### Epic D: Update 12 Commands (18 pts)

| Story | Points | Command | Key Changes |
|-------|--------|---------|-------------|
| D-1 | 2 | /init | Add enhanced health checks, token budget check |
| D-2 | 2 | /close | Add quick sync check, sequence suggestion |
| D-3 | 2 | /strategy | Add aliases, absorb sprint-planning |
| D-4 | 1 | /coding | Add token budget, doc tables |
| D-5 | 1 | /design | Update to v2.1, add doc tables |
| D-6 | 2 | /audit | Add enhanced governance scan |
| D-7 | 1 | /testing | Add doc tables |
| D-8 | 1 | /release-audit | Separate from deploy, add doc tables |
| D-9 | 2 | /deploy | NEW - create from scratch |
| D-10 | 2 | /quick-fix | NEW - create from scratch |
| D-11 | 1 | /general | Add aliases, absorb debug/research |
| D-12 | 1 | /sprint-review | Add aliases, doc tables |

**Exit Criteria**:
- [ ] All 12 commands updated to v2.0
- [ ] Consistent structure across all
- [ ] Aliases documented
- [ ] Token budgets defined
- [ ] Bidirectional validation included

---

### Epic E: Stale Reference Fix (4 pts)

| Story | Points | Scope |
|-------|--------|-------|
| E-1 | 2 | Remove "Sprint-3", "Sprint 15A" hardcodes |
| E-2 | 1 | Update dynamic sprint detection in /init |
| E-3 | 1 | Fix entry-point docs with stale paths |

**Exit Criteria**:
- [ ] Zero hardcoded sprint references
- [ ] Dynamic detection works
- [ ] Entry-point docs accurate

---

### Epic F: Legacy Inventory (3 pts)

| Story | Points | Scope |
|-------|--------|-------|
| F-1 | 1.5 | Inventory Karvia_OKR_Product_Planning/ dependencies |
| F-2 | 1 | Inventory Karvia_OKR_Mockups/ dependencies |
| F-3 | 0.5 | Create recommendation doc for future merge |

**Exit Criteria**:
- [ ] All references inventoried
- [ ] Recommendation documented
- [ ] No action taken (just inventory)

---

### Epic G: Headers-Only Beta Context (3 pts)

| Story | Points | Scope |
|-------|--------|-------|
| G-1 | 3 | Add Beta context headers to 4 strategic docs |

**Exit Criteria**:
- [ ] 4 docs have Beta context headers
- [ ] Original content preserved
- [ ] Links to Beta docs accurate

---

### Epic H: Delete Redundant Commands (2 pts)

| Story | Points | Command | Action |
|-------|--------|---------|--------|
| H-1 | 0.5 | /sprint-planning | Delete (merged into /strategy) |
| H-2 | 0.5 | /debug | Delete (merged into /general) |
| H-3 | 0.5 | /research | Delete (merged into /general) |
| H-4 | 0.5 | Cleanup any orphan command files | - |

**Exit Criteria**:
- [ ] Redundant command files removed
- [ ] No broken references

---

### Epic I: Create OPS Docs (2 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| I-1 | 1 | Create DEPLOYMENT_GUIDE.md (T2-OPS-003) |
| I-2 | 0.5 | Create RENDER_CONFIG.md (T2-OPS-004) |
| I-3 | 0.5 | Create HOTFIX_PLAYBOOK.md (T2-OPS-005) |

**Note**: These docs may already exist partially - consolidate if so.

**Exit Criteria**:
- [ ] 3 OPS docs exist with genome tags
- [ ] /deploy and /quick-fix can reference them

---

## 8. Implementation Schedule

| Day | Focus | Points | Deliverables |
|-----|-------|--------|--------------|
| **1** | Epic A + B + C (T0) | 8 | CLAUDE.md governance, session matrix, T0 tags |
| **2** | Epic C (T1, T2, CMD) | 10 | T1/T2/CMD genome tags |
| **3** | Epic D (Core commands) | 10 | /init, /close, /strategy, /coding, /design, /audit |
| **4** | Epic D (Support) + E | 12 | /testing, /release-audit, /deploy, /quick-fix, /general, /review + stale fixes |
| **5** | Epic F + G + H + I | 10 | Legacy inventory, Beta headers, cleanup, OPS docs |

**Total**: 48 points / 5 days (9.6 pts/day average)

---

## 9. Success Criteria

### Quantitative

| Metric | Target | Validation |
|--------|--------|------------|
| Docs with genome tags | 35+ | `grep -r "@GENOME" \| wc -l` |
| Commands updated | 12 | Visual check |
| Commands deleted | 3 | Verify removed |
| Hardcoded sprint refs | 0 | `grep -r "Sprint-3\|Sprint 15A"` |
| New governance files | 0 | No DOC_ID_REGISTRY.md etc. |
| Lines per genome tag | 1 | Visual check |
| Commands with aliases | 4 | /strategy, /general, /quick-fix, /sprint-review |
| Session matrix rows | 15+ | CONTEXT_REGISTRY check |

### Qualitative

| Criterion | Validation |
|-----------|------------|
| Zero ambiguity | Two Claude instances get same context |
| Complete context | No "missing doc" errors |
| Discoverable | Aliases work, L2 docs findable |
| Scalable | Grep works, thresholds documented |
| Self-maintaining | /init flags issues, /close syncs, /audit repairs |
| Bidirectional | Commands ↔ Docs references match |
| Status-aware | ARCHIVED/DRAFT not loaded as AUTO |
| Token-safe | No command exceeds 5,000 AUTO tokens |

### Test Scenarios

**Scenario 1**: New Claude runs /coding
- Expected: Reads CLAUDE.md §Technical, handoff, tech spec (~1,800 tokens)
- Validation: Claude knows all required context, no overflow

**Scenario 2**: Doc created without genome tag
- Expected: /init flags "orphan detected" (if in governed dir)
- Validation: System catches the gap

**Scenario 3**: User searches "/sprint-planning"
- Expected: Finds /strategy (via alias)
- Validation: Discoverability maintained

**Scenario 4**: ARCHIVED doc in /coding AUTO list
- Expected: /init flags "WARNING: /coding loads ARCHIVED doc"
- Validation: Stale context prevented

**Scenario 5**: Production bug discovered
- Expected: /quick-fix loads minimal context, follows protocol
- Validation: Fast response, targeted fix

**Scenario 6**: Deployment to production
- Expected: /deploy has environment matrix, procedures
- Validation: Clear, safe deployment

---

## 10. Files Summary

### Files to Modify

| File | Change | Epic |
|------|--------|------|
| CLAUDE.md | Add §Document Governance (~100 lines) | A |
| CONTEXT_REGISTRY.md | Add session matrix section | B |
| SESSION_LOG.md | Add genome tag | C |
| All T1/T2 docs | Add genome tags | C |
| All 12 command files | Full v2.0 update | D |

### Files to Create

| File | Purpose | Epic |
|------|---------|------|
| deploy.md | /deploy command | D |
| quick-fix.md | /quick-fix command | D |
| DEPLOYMENT_GUIDE.md | Deployment procedures (if not exists) | I |
| RENDER_CONFIG.md | Environment config (if not exists) | I |
| HOTFIX_PLAYBOOK.md | Emergency response (if not exists) | I |

### Files to Delete

| File | Reason | Epic |
|------|--------|------|
| sprint-planning.md | Merged into /strategy | H |
| debug.md | Merged into /general | H |
| research.md | Merged into /general | H |

### Files NOT Created

| Would-Be File | Why Not Created |
|---------------|-----------------|
| DOC_ID_REGISTRY.md | Computed via grep |
| SESSION_DOC_MATRIX.md | Section in CONTEXT_REGISTRY |
| GENOME_SPECIFICATION.md | Section in CLAUDE.md |

---

## Appendix: Quick Reference

### Genome Tag Format
```
<!-- @GENOME T[0-3]-[DOM]-[SEQ]-[YYMM] | [STATUS] | [DATE] | parent:[ID] | auto:[cmds] | linked:[cmds] -->
```

### Domain Codes
```
GOV PRD ARC SPR TST OPS DES CMD SES
```

### Status Values
```
ACTIVE DRAFT ARCHIVED
```

### 12 Commands (with aliases)
```
/init /close /strategy (/sprint-planning, /plan) /coding /design /audit /testing /release-audit /deploy /quick-fix (/hotfix) /general (/debug, /research) /sprint-review (/retro)
```

### Token Budgets
```
AUTO soft limit: 3,000
AUTO hard limit: 5,000
Highest: /strategy (~2,500)
Lowest: /general (~300)
```

### Governed Directories
```
.claude/
KARVIA_STRATEGY/1-PRODUCT/
KARVIA_STRATEGY/2-TECHNICAL/
KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-*/
KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/
```

### Common Queries
```bash
# All governed docs
grep -r "@GENOME" --include="*.md"

# Find children
grep "parent:T0-GOV-001" --include="*.md"

# Find docs for /coding
grep "auto:.*coding" --include="*.md"

# Find stale docs
grep "@GENOME.*2025-" --include="*.md"

# Find orphans (governed dirs only)
find .claude KARVIA_STRATEGY/1-PRODUCT KARVIA_STRATEGY/2-TECHNICAL -name "*.md" -exec grep -L "@GENOME" {} \;

# Find ARCHIVED in AUTO
grep "ARCHIVED" --include="*.md" | grep "@GENOME"
```

---

**Document Owner**: Claude + Sagar
**Created**: March 30, 2026
**Version**: 4.0 (Hardened Edition)
**Status**: APPROVED - READY FOR EXECUTION
**Delta from V3**: +8 points (session matrix, /deploy, /quick-fix, 9 hardening improvements)
**Next Step**: Begin Day 1 - Epic A (CLAUDE.md governance section)
