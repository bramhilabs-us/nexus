# Sprint 20.5 - Pre-Beta Documentation Governance (Zero-Load Edition)

**Version**: 3.0
**Created**: March 30, 2026
**Status**: APPROVED - READY FOR EXECUTION
**Type**: Pre-Beta Bridge Sprint
**Points**: 40
**Duration**: 5 days
**Gate**: Must complete before Sprint 21 (Beta starts Apr 1)

---

## Executive Summary

Sprint 20.5 establishes **zero-ambiguity documentation governance** with **zero extra load** through:

1. **One-Line Genome Tags** - Single line per doc, not 50-line headers
2. **Computed Registry** - Grep-based, always accurate, no maintenance file
3. **Self-Documenting Commands** - Each command lists its own docs
4. **Bidirectional Validation** - Commands reference docs, docs reference commands
5. **12 Consolidated Commands** - Down from 17, SDLC-aligned

**Core Principle**: Information lives where it's used. No separate files that drift.

**Supersedes**: Sprint 16D (folder renamed), Sprint 20.5 V1/V2

---

## Table of Contents

1. [Zero-Load Philosophy](#1-zero-load-philosophy)
2. [One-Line Genome Tags](#2-one-line-genome-tags)
3. [Computed Registry](#3-computed-registry)
4. [12 Commands](#4-12-commands)
5. [Bidirectional Validation](#5-bidirectional-validation)
6. [Epic Breakdown](#6-epic-breakdown)
7. [Implementation Schedule](#7-implementation-schedule)
8. [Success Criteria](#8-success-criteria)

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
| Commands self-document | Doc lists IN command files | 0 files |
| Governance in CLAUDE.md | Add section to existing doc | +50 lines total |

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

### Placement

Tag goes on **line 3** of every governed doc (after title and blank line):

```markdown
# Document Title

<!-- @GENOME T2-ARC-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/design -->

Document content begins here...
```

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

### Common Queries

| Need | Command |
|------|---------|
| All governed docs | `grep -r "@GENOME" --include="*.md"` |
| Find children of T0-GOV-001 | `grep -r "parent:T0-GOV-001" --include="*.md"` |
| Find docs for /coding | `grep -r "auto:.*coding" --include="*.md"` |
| Find stale docs | `grep -r "@GENOME.*2025-" --include="*.md"` |
| Find archived docs | `grep -r "ARCHIVED" --include="*.md" \| grep "@GENOME"` |
| Count orphans | Compare `find -name "*.md"` count with `grep "@GENOME"` count |

### Why This Works

| Concern | Resolution |
|---------|------------|
| "Grep is slow" | ~600 .md files, grep takes <1 second |
| "Results not formatted" | Parseable, can pipe to awk/sort |
| "No single file to read" | Claude can grep and parse mentally |
| "What about children?" | Computed from parent references |

---

## 4. 12 Commands

### Consolidation (17 → 12)

| Keep | Absorbs | Rationale |
|------|---------|-----------|
| `/init` | - | Core workflow |
| `/close` | - | Core workflow |
| `/strategy` | `/sprint-planning` | Both are planning sessions |
| `/coding` | - | Core development |
| `/design` | - | Distinct skillset |
| `/audit` | - | Quality focus |
| `/testing` | - | QA focus |
| `/release-audit` | `/deploy` | Both are release gates |
| `/general` | `/debug`, `/research` | Ad-hoc catch-all |
| `/sprint-review` | - | Retrospective |
| **Dropped** | | |
| ~~`/insights`~~ | - | Rarely used |
| ~~`/bootstrap`~~ | - | One-time setup |
| ~~`/setup`~~ | - | One-time setup |

### Command Structure Template

Each command follows this structure:

```markdown
# /[command] Session

**Version**: 2.0.0
**Last Updated**: [DATE]
**Session Type**: [TYPE]

<!-- @GENOME T2-CMD-xxx | ACTIVE | [DATE] | parent:T0-GOV-001 | auto:/init -->

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| [Role] | [Skills] | [Context] |

---

## Document Context

### AUTO (Read at session start)

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| [Doc] | [ID] | ~[N] | [Sections] |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| [Doc] | [ID] | [Path] |

### AVAILABLE (Exists, request on demand)

- [Doc category]
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

### 4.1 `/init` - Session Orientation

**Purpose**: Restore context for new Claude instance

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

#### Governance Health Check (NEW)

```markdown
## Step 0.5: Health Check (30 seconds)

1. **Quick Orphan Detection**:
   - Tracked dirs: .claude/, KARVIA_STRATEGY/1-PRODUCT/, KARVIA_STRATEGY/2-TECHNICAL/
   - Count .md files: `find [dirs] -name "*.md" | wc -l`
   - Count genome tags: `grep -r "@GENOME" [dirs] | wc -l`
   - If tags < 80% of files → Flag: "Orphan docs detected"

2. **Stale Detection**:
   - Find year-old: `grep "@GENOME.*2025-" --include="*.md"`
   - If > 5 found → Flag: "Stale docs detected"

3. **Action**: Flag only, don't block. Suggest /audit if critical.
```

#### Exit Criteria

- [ ] Context restored
- [ ] Current sprint identified
- [ ] Session type recommended
- [ ] Health flags reported (if any)

---

### 4.2 `/close` - Session Wrap-up

**Purpose**: Preserve context for next Claude instance

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

#### Genome Maintenance (NEW)

```markdown
## Step 4: Genome Sync

If documents were created this session:
1. Verify genome tag exists (line 3)
2. Verify format matches: <!-- @GENOME ... -->
3. Verify auto/linked fields include relevant commands

If documents were modified:
1. Update `updated` date in genome tag
2. Format: YYYY-MM-DD

No registry file to update - genome tags ARE the registry.
```

#### Exit Criteria

- [ ] Handoff updated with session summary
- [ ] SESSION_LOG.md entry added
- [ ] New docs have genome tags
- [ ] Modified docs have updated dates
- [ ] Next session recommended

---

### 4.3 `/strategy` - Executive Planning Room

**Purpose**: Strategic decisions, sprint planning, architecture choices

**Absorbs**: `/sprint-planning` (technical planning mode)

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

### 4.4 `/coding` - Developer Workbench

**Purpose**: Feature implementation, bug fixes

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

### 4.5 `/design` - UX Design Studio

**Purpose**: Mockups, design system, user experience

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

### 4.6 `/audit` - Quality Review Board

**Purpose**: Code quality, security, architecture compliance, governance health

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

#### Governance Audit Mode (NEW)

```markdown
## Full Governance Scan

When requested, perform deep validation:

1. **Orphan Detection**:
   ```bash
   # Find .md files without genome tags
   find .claude KARVIA_STRATEGY -name "*.md" -exec grep -L "@GENOME" {} \;
   ```

2. **Stale Detection**:
   ```bash
   # Find docs not updated in 90+ days
   grep -r "@GENOME" --include="*.md" | grep "2025-"
   ```

3. **Parent Validation**:
   ```bash
   # Extract all parent references
   grep -r "parent:" --include="*.md" | cut -d'|' -f4
   # Verify each parent ID exists
   ```

4. **Bidirectional Check**:
   ```bash
   # For each command, verify docs match
   grep "auto:.*coding" --include="*.md"
   # Compare with /coding AUTO list
   ```

5. **Report**: List findings, suggest fixes
```

#### Exit Criteria

- [ ] Findings documented (P1/P2/P3)
- [ ] Security issues flagged
- [ ] Governance health reported
- [ ] Fixes assigned

---

### 4.7 `/testing` - QA War Room

**Purpose**: Feature validation, bug detection, quality assurance

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

### 4.8 `/release-audit` - Release Gate Review

**Purpose**: Final checks before deployment (absorbs `/deploy`)

#### Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Release Manager | Gate keeping | Release checklist |
| Security Officer | Production security | Sign-off |
| QA Lead | Quality gate | Coverage report |
| DevOps Engineer | Deployment | Env config |

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
| Deployment guide | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| Rollback procedure | Same location |
| Render env vars | Same location |

**AVAILABLE**:
- Full audit report
- Previous deployment logs
- Incident response playbook

#### Exit Criteria

- [ ] All gate criteria met OR blockers documented
- [ ] Release APPROVED or BLOCKED with rationale
- [ ] Deployment steps confirmed
- [ ] Rollback ready

---

### 4.9 `/general` - Open Discussion Room

**Purpose**: Quick tasks, research, debugging (absorbs `/debug`, `/research`)

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
- [ ] Escalation path if complex

---

### 4.10 `/sprint-review` - Retrospective Room

**Purpose**: Sprint retrospective, learnings capture

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

## 5. Bidirectional Validation

### The Concept

```
┌─────────────────────────────────────────────────────────────────┐
│                    BIDIRECTIONAL LINKING                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Command → Doc                    Doc → Command                 │
│   ────────────────                 ────────────────              │
│   /coding AUTO list:               CONTEXT_REGISTRY.md tag:      │
│   - CONTEXT_REGISTRY.md            auto:/coding,/strategy        │
│                                                                  │
│   If these don't match → Something's wrong                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Validation Query

For any command, verify its AUTO list matches doc declarations:

```bash
# Find all docs that declare auto:/coding
grep "auto:.*coding" --include="*.md" .claude/ KARVIA_STRATEGY/

# Compare output with /coding command's AUTO list
# Discrepancy = either command is stale or doc tag is wrong
```

### When to Validate

| Trigger | Depth | Action |
|---------|-------|--------|
| Every /init | Light (count only) | Flag if mismatch |
| Every /close | None | Just update tags on changed docs |
| /audit request | Full | Complete bidirectional check |
| Monthly | Full | Scheduled governance review |

---

## 6. Epic Breakdown

### Epic A: Governance Section in CLAUDE.md (3 pts)

| Story | Points | Deliverable |
|-------|--------|-------------|
| A-1 | 2 | Add §Document Governance section to CLAUDE.md |
| A-2 | 1 | Include genome format, tier definitions, domain codes |

**Section Content** (~80 lines):

```markdown
## Document Governance

### Genome Tag Format
Every governed doc has a one-line tag on line 3:
<!-- @GENOME [ID] | [STATUS] | [UPDATED] | parent:[PARENT] | auto:[COMMANDS] | linked:[COMMANDS] -->

### Tier System
- T0: Constitutional (requires approval)
- T1: Strategic (product owner)
- T2: Canonical (technical lead)
- T3: Working (any contributor)

### Domain Codes
GOV, PRD, ARC, SPR, TST, OPS, DES, CMD, SES

### When Creating Documents
1. Determine tier (T0-T3) based on governance level
2. Determine domain (3-letter code)
3. Assign sequence: next number in that domain
4. Create ID: T[tier]-[domain]-[seq]-[YYMM]
5. Add genome tag on line 3

### When Modifying Documents
1. Update the `updated` date field in genome tag
2. If changing which commands use it, update auto/linked fields

### Registry Queries
Registry is computed, not stored. Common queries:
- All governed docs: grep -r "@GENOME" --include="*.md"
- Find children: grep "parent:[ID]" --include="*.md"
- Find docs for command: grep "auto:.*[cmd]" --include="*.md"
```

**Exit Criteria**:
- [ ] Section added to CLAUDE.md
- [ ] Format documented
- [ ] Examples provided

---

### Epic B: Apply Genome Tags (10 pts)

| Story | Points | Docs | Count |
|-------|--------|------|-------|
| B-1 | 2 | T0 docs | 3 |
| B-2 | 3 | T1 docs | 5 |
| B-3 | 3 | T2 docs | 12 |
| B-4 | 2 | Commands (T2-CMD) | 10 |

**T0 Documents** (Constitutional):

| Doc | ID | Auto |
|-----|-----|------|
| CLAUDE.md | T0-GOV-001-2511 | /init,/coding,/strategy,/design,/audit,/testing |
| SESSION_LOG.md | T0-SES-001-2511 | /init,/close,/sprint-review |
| (DOC_ID computed) | - | - |

**T1 Documents** (Strategic):

| Doc | ID | Auto |
|-----|-----|------|
| PRODUCT_VISION.md | T1-PRD-001-2511 | /strategy |
| BETA_ROADMAP.md | T1-PRD-002-2603 | /strategy |
| PRODUCT_STRATEGY_MASTER.md | T1-PRD-003-2511 | /strategy |
| (+ 2 more) | | |

**T2 Documents** (Canonical):

| Doc | ID | Auto |
|-----|-----|------|
| CONTEXT_REGISTRY.md | T2-ARC-001-2603 | /coding,/strategy |
| DESIGN_SYSTEM.md | T2-DES-001-2511 | /design |
| YSELA_UX_PRINCIPLES.md | T2-DES-002-2603 | /design |
| AUDIT_TRACKER.md | T2-GOV-003-2601 | /audit |
| (+ 8 more) | | |

**Command Files** (T2-CMD):

| Doc | ID | Auto |
|-----|-----|------|
| init.md | T2-CMD-001-2603 | /init (self-reference) |
| close.md | T2-CMD-002-2603 | - |
| strategy.md | T2-CMD-003-2603 | - |
| coding.md | T2-CMD-004-2603 | - |
| (+ 6 more) | | |

**Exit Criteria**:
- [ ] All 30 docs have genome tags
- [ ] Tags follow format exactly
- [ ] Parent references valid
- [ ] Auto/linked fields accurate

---

### Epic C: Update 10 Commands (15 pts)

| Story | Points | Command | Changes |
|-------|--------|---------|---------|
| C-1 | 2 | /init | Add health check, genome tag |
| C-2 | 1 | /close | Add genome sync, genome tag |
| C-3 | 2 | /strategy | Absorb sprint-planning, add doc tables |
| C-4 | 2 | /coding | Add doc tables, bidirectional note |
| C-5 | 1 | /design | Update to v2.1, add doc tables |
| C-6 | 2 | /audit | Add governance scan mode |
| C-7 | 1 | /testing | Add doc tables |
| C-8 | 2 | /release-audit | Absorb deploy, add doc tables |
| C-9 | 1 | /general | Absorb debug/research modes |
| C-10 | 1 | /sprint-review | Add doc tables |

**Changes Per Command**:
1. Add genome tag (line 3)
2. Add stakeholder table
3. Add AUTO/LINKED/AVAILABLE doc tables with IDs
4. Add bidirectional validation query
5. Remove hardcoded sprint references
6. Update version to 2.0.0

**Exit Criteria**:
- [ ] All 10 commands updated
- [ ] Consistent structure
- [ ] No hardcoded sprints
- [ ] Bidirectional validation included

---

### Epic D: Stale Reference Fix (4 pts)

| Story | Points | Scope |
|-------|--------|-------|
| D-1 | 2 | Remove "Sprint-3", "Sprint 15A" hardcodes from commands |
| D-2 | 1 | Update dynamic sprint detection in /init |
| D-3 | 1 | Fix entry-point docs with stale paths |

**Dynamic Sprint Detection**:

```markdown
## Finding Current Sprint

Use handoff chain:
1. Read SESSION_LOG.md → last session references handoff
2. Handoff references sprint folder
3. Sprint folder contains all sprint docs

Alternative (if needed):
```bash
ls -d KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*/ | grep -v "Complete\|Superseded\|Skipped"
```
```

**Exit Criteria**:
- [ ] Zero hardcoded sprint references
- [ ] Dynamic detection works
- [ ] Entry-point docs accurate

---

### Epic E: Legacy Inventory (3 pts)

| Story | Points | Scope |
|-------|--------|-------|
| E-1 | 1.5 | Inventory Karvia_OKR_Product_Planning/ dependencies |
| E-2 | 1 | Inventory Karvia_OKR_Mockups/ dependencies |
| E-3 | 0.5 | Create recommendation doc for future merge |

**Inventory Method**:

```bash
# Find all references to legacy folders
grep -r "Karvia_OKR_Product_Planning" --include="*.md" --include="*.js"
grep -r "Karvia_OKR_Mockups" --include="*.md" --include="*.js"
```

**Exit Criteria**:
- [ ] All references inventoried
- [ ] Recommendation documented
- [ ] No action taken (just inventory)

---

### Epic F: Headers-Only Beta Context (3 pts)

| Story | Points | Scope |
|-------|--------|-------|
| F-1 | 3 | Add Beta context headers to 4 strategic docs |

**Docs to Update**:

1. PRODUCT_VISION.md
2. PRODUCT_STRATEGY_MASTER.md
3. (2 others as identified)

**Header Format**:

```markdown
# Document Title

<!-- @GENOME T1-PRD-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/strategy -->

> **HISTORICAL CONTEXT**: This document reflects OKR-era positioning (2025).
> For Beta (2026), see [BETA_RELEASE_PROJECT_ROADMAP.md](path).
> Evolution: "OKR Platform" → "YSELA - Behavior Transformation OS"

[Original content unchanged...]
```

**Exit Criteria**:
- [ ] 4 docs have Beta context headers
- [ ] Original content preserved
- [ ] Links to Beta docs accurate

---

### Epic G: Delete Redundant Commands (2 pts)

| Story | Points | Command | Action |
|-------|--------|---------|--------|
| G-1 | 0.5 | /sprint-planning | Delete (merged into /strategy) |
| G-2 | 0.5 | /deploy | Delete (merged into /release-audit) |
| G-3 | 0.5 | /debug | Delete (merged into /general) |
| G-4 | 0.5 | /research | Delete (merged into /general) |

**Note**: /insights, /bootstrap, /setup may already not exist or can be left as minimal.

**Exit Criteria**:
- [ ] Redundant command files removed
- [ ] No broken references

---

## 7. Implementation Schedule

| Day | Focus | Points | Deliverables |
|-----|-------|--------|--------------|
| **1** | Epic A + B (T0) | 5 | CLAUDE.md governance section, T0 genome tags |
| **2** | Epic B (T1, T2) | 8 | T1/T2 genome tags, command genome tags |
| **3** | Epic C (Core) | 8 | /init, /close, /strategy, /coding, /design |
| **4** | Epic C (Support) + D | 9 | /audit, /testing, /release-audit, /general, /sprint-review, stale fixes |
| **5** | Epic E + F + G | 8 | Legacy inventory, Beta headers, command cleanup |

**Total**: 40 points / 5 days (8 pts/day average)

---

## 8. Success Criteria

### Quantitative

| Metric | Target | Validation |
|--------|--------|------------|
| Docs with genome tags | 30 | `grep -r "@GENOME" \| wc -l` |
| Commands updated | 10 | Visual check |
| Commands deleted | 4 | Verify removed |
| Hardcoded sprint refs | 0 | `grep -r "Sprint-3\|Sprint 15A"` |
| New governance files | 0 | No DOC_ID_REGISTRY.md etc. |
| Lines per genome tag | 1 | Visual check |

### Qualitative

| Criterion | Validation |
|-----------|------------|
| Zero ambiguity | Two Claude instances get same context |
| Complete context | No "missing doc" errors |
| Discoverable | L2 docs findable via LINKED |
| Scalable | Grep works as docs grow |
| Self-maintaining | /init flags issues, /audit repairs |
| Bidirectional | Commands ↔ Docs references match |

### Test Scenarios

**Scenario 1**: New Claude runs /coding
- Expected: Reads CLAUDE.md §Technical, handoff, tech spec
- Validation: Claude knows all required context

**Scenario 2**: Doc created without genome tag
- Expected: /init flags "orphan detected"
- Validation: System catches the gap

**Scenario 3**: Command doc list becomes stale
- Expected: Bidirectional check in /audit catches mismatch
- Validation: Discrepancy reported

---

## 9. Files Summary

### Files to Modify

| File | Change | Epic |
|------|--------|------|
| CLAUDE.md | Add §Document Governance section | A |
| SESSION_LOG.md | Add genome tag | B |
| CONTEXT_REGISTRY.md | Add genome tag | B |
| DESIGN_SYSTEM.md | Add genome tag | B |
| YSELA_UX_PRINCIPLES.md | Add genome tag | B |
| PRODUCT_VISION.md | Add genome tag + Beta header | B, F |
| BETA_ROADMAP.md | Add genome tag | B |
| AUDIT_TRACKER.md | Add genome tag | B |
| init.md | Full update v2.0 | C |
| close.md | Full update v2.0 | C |
| strategy.md | Full update v2.0 | C |
| coding.md | Full update v2.0 | C |
| design.md | Update to v2.1 | C |
| audit.md | Full update v2.0 | C |
| testing.md | Full update v2.0 | C |
| release-audit.md | Full update v2.0 | C |
| general.md | Full update v2.0 | C |
| sprint-review.md | Full update v2.0 | C |
| (+ ~12 more T2 docs) | Add genome tags | B |

### Files to Delete

| File | Reason | Epic |
|------|--------|------|
| sprint-planning.md | Merged into /strategy | G |
| deploy.md | Merged into /release-audit | G |
| debug.md | Merged into /general | G |
| research.md | Merged into /general | G |

### Files NOT Created

| Would-Be File | Why Not Created |
|---------------|-----------------|
| DOC_ID_REGISTRY.md | Computed via grep |
| SESSION_DOC_MATRIX.md | Embedded in commands |
| GENOME_SPECIFICATION.md | Section in CLAUDE.md |
| GENOME_TEMPLATE.md | Example in CLAUDE.md |

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

# Find orphans
find .claude KARVIA_STRATEGY -name "*.md" -exec grep -L "@GENOME" {} \;
```

### 12 Commands
```
/init /close /strategy /coding /design /audit /testing /release-audit /general /sprint-review
```

---

**Document Owner**: Claude + Sagar
**Created**: March 30, 2026
**Version**: 3.0 (Zero-Load Edition)
**Status**: APPROVED - READY FOR EXECUTION
**Next Step**: Begin Day 1 - Epic A (CLAUDE.md governance section)
