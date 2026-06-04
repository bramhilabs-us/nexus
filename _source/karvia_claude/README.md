# .claude - Claude Code Intelligence Hub

<!-- @GENOME T2-NAV-001 | ACTIVE | 2026-03-31 | parent:T0-GOV-001 | auto:- | linked:/init -->

**Version**: 1.0.0
**Last Updated**: March 30, 2026
**Status**: Active

---

## Purpose

This folder contains all Claude Code session management, context loading, and automation tools for the Karvia Business project. It serves as the **single source of truth** for how Claude interacts with this codebase.

---

## Quick Start

| Action | Command | Purpose |
|--------|---------|---------|
| Start session | `/init` | Initialize with full context |
| Plan work | `/strategy` | Sprint planning, architecture |
| Write code | `/coding` | Feature implementation |
| Review code | `/audit` | Quality validation |
| Test features | `/testing` | Bug detection, validation |
| Quick tasks | `/general` | Research, Q&A, quick fixes |
| Design UI | `/design` | Mockups, visual specs |
| End session | `/close` | Proper closure with handoff |

---

## Folder Structure

```
.claude/
├── README.md                 # This file - entry point
├── SESSION_LOG.md            # Session history (read first!)
├── CONTEXT_REGISTRY.md       # What to read before creating
├── DESIGN_SYSTEM.md          # Color tokens and UI patterns
├── MASTER_GUIDE.md           # File placement rules
├── BEST_PRACTICES.md         # Coding and quality standards
├── DOCUMENT_REGISTRY.md      # Document index
│
├── commands/                 # Slash commands (13 files)
│   ├── init.md               # Session initialization (v2.0.0)
│   ├── strategy.md           # Planning sessions
│   ├── coding.md             # Implementation sessions
│   ├── audit.md              # Code review sessions
│   ├── testing.md            # Testing sessions
│   ├── general.md            # General purpose sessions
│   ├── design.md             # UI/UX design sessions
│   ├── close.md              # Session closure
│   └── ...                   # + 5 more commands
│
├── templates/                # Document templates (13 files)
│
├── sessions/
│   └── handoffs/             # Session handoff files
│
├── automation/               # Automation scripts
│
└── archives/                 # Archived content
    ├── legacy-2026-01-08/    # Legacy structure
    ├── bramhi-legacy/        # BRAMHI framework
    ├── session-legacy/       # Old session tracking
    └── comparison-reports/   # One-time comparisons
```

---

## Key Files

### Session Management

| File | Purpose | Read When |
|------|---------|-----------|
| [SESSION_LOG.md](SESSION_LOG.md) | Complete session history | Every session start |
| [CONTEXT_REGISTRY.md](CONTEXT_REGISTRY.md) | What to read before creating | Before any file creation |
| [MASTER_GUIDE.md](MASTER_GUIDE.md) | Overall Claude strategy | New to project |

### Design & UI

| File | Purpose | Read When |
|------|---------|-----------|
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Color tokens, UI patterns | Any frontend work |
| [CODEBASE_STRUCTURE.md](CODEBASE_STRUCTURE.md) | Project file structure | Exploring codebase |
| [DATA_STRUCTURE.md](DATA_STRUCTURE.md) | Database models | Backend work |

### Quality & Standards

| File | Purpose | Read When |
|------|---------|-----------|
| [BEST_PRACTICES.md](BEST_PRACTICES.md) | Coding standards | Writing code |
| [DOCUMENT_STANDARDS.md](DOCUMENT_STANDARDS.md) | Doc formatting | Creating docs |
| [PERFORMANCE_METRICS.md](PERFORMANCE_METRICS.md) | Session metrics | Evaluating quality |

---

## Session Types

### Available Commands

| Command | Type | Token Budget | Use For |
|---------|------|--------------|---------|
| `/init` | Setup | 10-20K | Session start |
| `/strategy` | Planning | 40-60K | Sprint planning, architecture |
| `/coding` | Implementation | 80-120K | Feature development |
| `/audit` | Review | 50-70K | Code quality review |
| `/testing` | Validation | 40-60K | Testing and bug detection |
| `/general` | Utility | 20-40K | Research, Q&A, quick fixes |
| `/design` | UI/UX | 60-80K | Mockups, visual specs |
| `/close` | Closure | 10-20K | Session closure |

### Session Flow

```
/init → Session Type → Work → /close
  │         │            │
  │         ├─ /strategy ─┤
  │         ├─ /coding ───┤
  │         ├─ /audit ────┤
  │         ├─ /testing ──┤
  │         ├─ /design ───┤
  │         └─ /general ──┤
  │                       │
  └─ SESSION_LOG.md ←─────┘
```

---

## Design Systems

Karvia uses **two color systems**:

### Primary System (Purple)
- Main app, dashboards, goals
- Primary: `#7C3AED` (`--karvia-primary`)
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) §Primary

### SSI System (Navy/Gold)
- Assessment reports, SSI views
- Navy: `#1e3a5f` (`--ssi-navy`)
- Gold: `#c9a227` (`--ssi-gold`)
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) §SSI

---

## Context Loading

Before creating any file, check [CONTEXT_REGISTRY.md](CONTEXT_REGISTRY.md):

| Creating | Primary Reference |
|----------|-------------------|
| API endpoint | CLAUDE.md, routes/*.js |
| Database model | models/*.js |
| Frontend page | common.js, navigation.js |
| Sprint plan | DOC_STANDARDS.md |
| Test file | tests/, ValidationService |
| Email template | mailjetService.js |
| AI/LLM feature | AIContextService.js |

---

## Integration with Project

### Related Root Files

- `CLAUDE.md` - Master codebase instructions
- `CLAUDE_STRATEGY.md` - Overall Claude strategy
- `README.md` - Project overview

### Sprint Documentation

```
KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/
├── SPRINT-15 (Complete)/
├── SPRINT-15A (In Progress)/
│   ├── SPRINT15A_HANDOFF_DOCUMENT.md
│   └── SESSION_BREAK_NOTES.md (if exists)
└── SPRINT-16D (Planned)/
```

---

## Quality Gates

All Claude sessions must pass:

### Security
- XSS prevention via `escapeHtml()`
- Multi-tenant isolation (company_id)
- RBAC enforcement
- No hardcoded secrets

### Architecture
- RESTful conventions
- Error handling
- Graceful degradation
- Soft delete pattern

### Documentation
- Session log updated
- Handoff document current
- Session break notes (if >60% tokens)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-03-06 | Folder cleanup: archived BRAMHI, consolidated sessions |
| 1.0.0 | 2026-03-06 | Initial README, CONTEXT_REGISTRY, DESIGN_SYSTEM, /design command |

---

## Maintenance

**Owner**: Development Team
**Review Cycle**: Monthly
**Update Triggers**:
- New commands added
- New files created
- Session protocol changes
- Design system updates

---

**Document Status**: Active - Entry point for .claude folder
