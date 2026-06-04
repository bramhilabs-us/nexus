# BRAMHI Canonical Structure

**Version**: 1.0.0
**Last Updated**: January 7, 2026
**Owner**: BRAMHI_LABS
**Status**: Active

---

## Purpose

This document defines the **canonical .claude folder structure** that MUST be identical across all BRAMHI_LABS repositories. No renames, no omissions, no variations.

---

## Universal Folder Contract

```
.claude/
│
│ ══════════════════════════════════════════════════════════════
│ TIER 1: CORE GOVERNANCE (Admin Only - Required)
│ ══════════════════════════════════════════════════════════════
│
├── README.md                               # Project orientation + session seal
│   └── Contains: Quick start, folder map, session lifecycle, key entry points
│
├── MASTER_GUIDE.md                         # File placement rules
│   └── Contains: Where to put code, docs, configs, tests
│
├── BEST_PRACTICES.md                       # Quality standards
│   └── Contains: Code quality, security, documentation, session rules
│
├── DOCUMENT_STANDARDS.md                   # Document governance + link verification
│   └── Contains: Naming, versioning, tiers, templates, link validation
│
├── ACCESS_CONTROL.yaml                     # Role-based permissions
│   └── Contains: Profiles (Developer/Architect/Admin), document access
│
├── project.yaml                            # Project configuration
│   └── Contains: Project name, version, team, tech stack, milestones
│
│ ══════════════════════════════════════════════════════════════
│ TIER 2: PROJECT CONTEXT (Architect+ - Required)
│ ══════════════════════════════════════════════════════════════
│
├── CODEBASE_STRUCTURE.md                   # Code organization map
│   └── Contains: Folder tree, file purposes, naming conventions
│
├── DATA_STRUCTURE.md                       # Documentation organization
│   └── Contains: Doc folder tree, data models, schema locations
│
├── DOCUMENT_REGISTRY.md                    # Document tracking
│   └── Contains: All docs with versions, status, last updated
│
│ ══════════════════════════════════════════════════════════════
│ TIER 3: OPERATIONAL (Developer+ - Required)
│ ══════════════════════════════════════════════════════════════
│
├── SESSION_LOG.md                          # Session history (DEPRECATED - use sessions/)
│   └── Contains: Legacy entries, points to SESSION_INDEX.md
│
├── CHANGE_LOG.md                           # Change tracking
│   └── Contains: All changes by date, session, scope
│
├── QUICK_START.md                          # Zero-context startup guide
│   └── Contains: 5 files to read first, slash commands, checklist
│
├── CLAUDE_CHECKLIST.md                     # Unified quality gates
│   └── Contains: Security, architecture, documentation gates
│
├── PERFORMANCE_METRICS.md                  # KPI tracking
│   └── Contains: CER, TCV, TES, RAI scores per session
│
│ ══════════════════════════════════════════════════════════════
│ TIER 4: EXECUTION (All - Required)
│ ══════════════════════════════════════════════════════════════
│
├── commands/                               # Slash commands (10 required)
│   ├── init.md                             # /init - Session initialization
│   ├── bootstrap.md                        # /bootstrap - Codebase discovery
│   ├── setup.md                            # /setup - New project scaffolding
│   ├── strategy.md                         # /strategy - Planning sessions
│   ├── coding.md                           # /coding - Implementation
│   ├── testing.md                          # /testing - Test execution
│   ├── audit.md                            # /audit - Code review
│   ├── general.md                          # /general - Research/questions
│   ├── release-audit.md                    # /release-audit - Post-release audit
│   └── close.md                            # /close - Session closure
│
├── templates/                              # Document templates (13 required)
│   ├── README_TEMPLATE.md                  # Folder README
│   ├── MVG_TEMPLATE.md                     # Governance documents
│   ├── GENOME_TEMPLATE.md                  # Document genome/DNA
│   ├── SESSION_SEAL_TEMPLATE.md            # Session seal block
│   ├── STRATEGY_FULL_TEMPLATE.md           # T1/T2 strategy docs
│   ├── STRATEGY_DERIVED_TEMPLATE.md        # T3 derived docs
│   ├── WORKING_DOC_TEMPLATE.md             # T4 drafts/WIP
│   ├── OPERATIONAL_TEMPLATE.md             # Sprint/release/bug docs
│   ├── COMMAND_TEMPLATE.md                 # Claude command files
│   ├── SESSION_TEMPLATE.md                 # Individual session docs
│   ├── SPRINT_COMPACT_TEMPLATE.md          # Sprint-level compaction
│   ├── MILESTONE_COMPACT_TEMPLATE.md       # Milestone-level compaction
│   └── RELEASE_COMPACT_TEMPLATE.md         # Release-level compaction
│
├── sessions/                               # Session management
│   ├── SESSION_INDEX.md                    # Chronicle with aggregate metrics
│   ├── SESSION_PROTOCOL.md                 # Session management rules
│   └── handoffs/                           # Handoff documents by date
│       └── YYYY-MM-DD_handoff.md           # Daily handoff files
│
│ ══════════════════════════════════════════════════════════════
│ TIER 5: FRAMEWORK (Required for standardization)
│ ══════════════════════════════════════════════════════════════
│
├── bramhi/                                 # Framework management
│   ├── BRAMHI_MASTER_PLAN.md               # Standardization roadmap
│   ├── CANONICAL_STRUCTURE.md              # This file
│   ├── UNIFIED_CHECKLIST.md                # All quality gates combined
│   ├── KPI_SCHEMA.md                       # Metrics framework definition
│   └── verify_claude.sh                    # Validation script
│
│ ══════════════════════════════════════════════════════════════
│ TIER 6: OPTIONAL (Project-specific)
│ ══════════════════════════════════════════════════════════════
│
├── archives/                               # [OPT] Archived sessions
│   └── sessions/                           # Historical session data
│
├── automation/                             # [OPT] Session automation scripts
│   ├── start-session.js                    # Auto context gathering
│   ├── end-session.js                      # Auto handoff + KPI calc
│   └── package.json                        # Automation dependencies
│
└── modes/                                  # [OPT] Operation mode packages
    ├── code-mode.md                        # Coding context
    ├── test-mode.md                        # Testing context
    ├── debug-mode.md                       # Debugging context
    └── plan-mode.md                        # Planning context
```

---

## File Count Matrix

| Category | Files | Required | Notes |
|----------|-------|----------|-------|
| Core Governance | 6 | YES | T1 - Admin managed |
| Project Context | 3 | YES | T2 - Architect managed |
| Operational | 5 | YES | T3 - Team managed |
| Commands | 10 | YES | Identical across repos |
| Templates | 13 | YES | Identical across repos |
| Sessions | 3+ | YES | Minimum 3 files |
| Bramhi | 5 | YES | Framework management |
| **TOTAL REQUIRED** | **45+** | YES | Minimum viable |
| Optional | 6+ | NO | Project-specific |

---

## Naming Conventions (MANDATORY)

### File Names
```
UPPERCASE_WITH_UNDERSCORES.md    # Core governance docs
lowercase-with-dashes.md         # Command files, mode files
CamelCase.yaml                   # Config files
snake_case.sh                    # Scripts
```

### Folder Names
```
lowercase/                       # commands/, templates/, sessions/
bramhi/                          # Framework folder
archives/                        # Optional archival
automation/                      # Optional scripts
modes/                           # Optional mode packages
```

---

## Version Header Requirements

Every `.md` file MUST have:

```markdown
# Title

**Version**: X.Y.Z
**Last Updated**: YYYY-MM-DD
**Owner**: [Team/Role]
**Status**: [Draft|Active|Deprecated]
```

Every `.yaml` file MUST have:

```yaml
# Header comment
# Version: X.Y.Z
# Last Updated: YYYY-MM-DD
# Owner: [Team/Role]
```

---

## Cross-Repo Sync Rules

### Identical Files (Copy Verbatim)
These files MUST be identical across all repos:
- `commands/` - All 10 command files
- `templates/` - All 13 template files
- `bramhi/` - All 5 framework files
- `DOCUMENT_STANDARDS.md`
- `BEST_PRACTICES.md`
- `MASTER_GUIDE.md`
- `CLAUDE_CHECKLIST.md`
- `KPI_SCHEMA.md` (in bramhi/)

### Project-Specific Files (Regenerated)
These files are unique per project:
- `README.md` - Project-specific orientation
- `project.yaml` - Project configuration
- `CODEBASE_STRUCTURE.md` - Code organization
- `DATA_STRUCTURE.md` - Data organization
- `DOCUMENT_REGISTRY.md` - Document tracking
- `SESSION_LOG.md` - Session history
- `CHANGE_LOG.md` - Change tracking
- `PERFORMANCE_METRICS.md` - KPI data
- `sessions/SESSION_INDEX.md` - Session chronicle
- `ACCESS_CONTROL.yaml` - Project access rules

---

## Validation Checklist

```
REQUIRED FILES CHECK:
[ ] .claude/README.md exists
[ ] .claude/MASTER_GUIDE.md exists
[ ] .claude/BEST_PRACTICES.md exists
[ ] .claude/DOCUMENT_STANDARDS.md exists
[ ] .claude/ACCESS_CONTROL.yaml exists
[ ] .claude/project.yaml exists
[ ] .claude/CODEBASE_STRUCTURE.md exists
[ ] .claude/DATA_STRUCTURE.md exists
[ ] .claude/DOCUMENT_REGISTRY.md exists
[ ] .claude/SESSION_LOG.md exists
[ ] .claude/CHANGE_LOG.md exists
[ ] .claude/QUICK_START.md exists
[ ] .claude/CLAUDE_CHECKLIST.md exists
[ ] .claude/PERFORMANCE_METRICS.md exists
[ ] .claude/commands/ has 10 files
[ ] .claude/templates/ has 13 files
[ ] .claude/sessions/SESSION_INDEX.md exists
[ ] .claude/bramhi/ has 5 files

VERSION HEADER CHECK:
[ ] All .md files have Version header
[ ] All .md files have Last Updated header
[ ] All .md files have Owner header
[ ] All .md files have Status header

FRESHNESS CHECK:
[ ] SESSION_LOG.md updated < 7 days ago
[ ] CHANGE_LOG.md updated < 7 days ago
[ ] SESSION_INDEX.md updated < 7 days ago
```

---

## Migration Path

### From iBrain Structure
- Add: QUICK_START.md, CLAUDE_CHECKLIST.md, PERFORMANCE_METRICS.md
- Add: bramhi/ folder with all 5 files
- Update: Close.md to auto-update logs

### From Prodify Structure
- Add: DATA_STRUCTURE.md, DOCUMENT_REGISTRY.md
- Add: SESSION_LOG.md, CHANGE_LOG.md, project.yaml
- Add: QUICK_START.md, CLAUDE_CHECKLIST.md, PERFORMANCE_METRICS.md
- Add: bramhi/ folder with all 5 files

### From KARVIA Business Structure
- Rename: Claude_Performance_Key_Metrics.md → PERFORMANCE_METRICS.md
- Rename: ZERO_CONTEXT_ROADMAP.md → QUICK_START.md (merged)
- Add: ACCESS_CONTROL.yaml, DOCUMENT_STANDARDS.md
- Add: DATA_STRUCTURE.md, DOCUMENT_REGISTRY.md
- Add: bramhi/ folder with all 5 files
- Restructure: Flatten numbered folders to canonical structure

---

## Related Documents

- [BRAMHI_MASTER_PLAN.md](./BRAMHI_MASTER_PLAN.md) - Standardization roadmap
- [UNIFIED_CHECKLIST.md](./UNIFIED_CHECKLIST.md) - All quality gates
- [KPI_SCHEMA.md](./KPI_SCHEMA.md) - Metrics framework
- [verify_claude.sh](./verify_claude.sh) - Validation script

---

**Document Status**: Canonical structure definition for all BRAMHI_LABS repositories.
