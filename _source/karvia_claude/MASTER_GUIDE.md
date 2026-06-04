# KARVIA Business Master Guide - File Placement Rules

<!-- @GENOME T2-ARC-002 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/init | linked:/coding,/strategy -->

**Version**: 1.0.0
**Last Updated**: January 8, 2026
**Status**: MANDATORY
**Owner**: BRAMHI_LABS
**Purpose**: Define where every new file MUST be saved

---

## CRITICAL: File Placement Rules

**NEVER create files in:**
- Root folder (`/`)
- Random folders
- `KARVIA_STRATEGY/` root (use subfolders)

---

## Directory Structure & File Placement

### 1. Session Management (`.claude/`)

```
.claude/
├── README.md                  # Claude guide (exists)
├── MASTER_GUIDE.md            # THIS FILE - file placement rules
├── BEST_PRACTICES.md          # Quality standards (exists)
├── SESSION_LOG.md             # Session tracking (exists)
├── CHANGE_LOG.md              # Change tracking
├── CODEBASE_STRUCTURE.md      # Code map
├── DATA_STRUCTURE.md          # Docs map
├── DOCUMENT_REGISTRY.md       # Document index
├── commands/                  # Slash commands
│   └── *.md                   # Command files
├── templates/                 # Document templates
│   └── *.md                   # Template files
├── sessions/                  # Session archives
│   ├── SESSION_INDEX.md       # Session chronicle
│   └── handoffs/              # Handoff documents
└── bramhi/                    # Framework management
    └── *.md/sh                # BRAMHI files
```

**Save here if**: Session management, Claude-specific guides, slash commands

---

### 2. Strategy Documents (`KARVIA_STRATEGY/`)

```
KARVIA_STRATEGY/
├── 1-PRODUCT/
│   ├── README.md              # Product folder overview
│   ├── strategy/              # Strategy docs
│   │   ├── PRODUCT_STRATEGY.md
│   │   └── ROADMAP.md
│   ├── user-journeys/         # User persona journeys
│   └── user-stories/          # Product requirements
│
├── 2-TECHNICAL/
│   ├── README.md              # Technical folder overview
│   ├── architecture/          # System architecture
│   ├── api-specs/             # API specifications
│   └── data-models/           # Database schemas
│
└── 3-DELIVERY/
    ├── README.md              # Delivery folder overview
    ├── sprints/               # Sprint plans
    ├── releases/              # Release documentation
    └── handoffs/              # Session handoffs
```

**Save here if**: Strategy documents, product plans, architecture

---

### 3. Operations Documentation (`1-OPERATIONS/`)

```
1-OPERATIONS/
├── README.md                  # Operations overview
├── DEPLOYMENT/
│   ├── PRODUCTION_GUIDE.md
│   ├── CLAUDE_CHECKLIST.md
│   └── ROLLBACK_GUIDE.md
├── ENVIRONMENT/
│   ├── LOCAL_CHANGES.md
│   ├── health-check.sh
│   └── verify-environment.js
└── MONITORING/
    ├── ENGINE_STATUS.md
    └── ALERT_PLAYBOOK.md
```

**Save here if**: Operations guides, deployment docs, environment configs

---

### 4. Development Standards (`2-DEVELOPMENT/`)

```
2-DEVELOPMENT/
├── README.md                  # Development overview
├── LOCAL_SETUP/
│   └── LOCAL_DEVELOPMENT_CHECKLIST.md
└── STANDARDS/
    └── CODE_STANDARDS.md
```

**Save here if**: Development guides, coding standards, local setup

---

### 5. Claude AI Tools (`3-CLAUDE_AI/`)

```
3-CLAUDE_AI/
├── BOOTLOADER.md              # Quick context loader
├── COMMAND_GUIDE.md           # Command reference
├── MODES/
│   ├── code-mode.md
│   └── test-mode.md
├── claude-automation/
│   ├── start-session.js
│   ├── end-session.js
│   └── package.json
└── SESSION_MANAGEMENT/
    └── HANDOFF_GUIDELINES.md
```

**Save here if**: Claude-specific tools, modes, automation scripts

---

## Quick Reference: Where to Save New Files

| Document Type | Save Location |
|--------------|---------------|
| Strategy docs | `KARVIA_STRATEGY/1-PRODUCT/strategy/` |
| User journeys | `KARVIA_STRATEGY/1-PRODUCT/user-journeys/` |
| User stories | `KARVIA_STRATEGY/1-PRODUCT/user-stories/` |
| Architecture | `KARVIA_STRATEGY/2-TECHNICAL/architecture/` |
| API specs | `KARVIA_STRATEGY/2-TECHNICAL/api-specs/` |
| Data models | `KARVIA_STRATEGY/2-TECHNICAL/data-models/` |
| Sprint plans | `KARVIA_STRATEGY/3-DELIVERY/sprints/` |
| Release notes | `KARVIA_STRATEGY/3-DELIVERY/releases/` |
| Session handoffs | `.claude/sessions/handoffs/` |
| Deployment docs | `1-OPERATIONS/DEPLOYMENT/` |
| Dev standards | `2-DEVELOPMENT/STANDARDS/` |
| Claude guides | `.claude/` |
| Slash commands | `.claude/commands/` |

---

## Naming Conventions

### File Names

| Type | Convention | Example |
|------|------------|---------|
| Master docs | `MASTER_*.md` | `MASTER_PRODUCT_STRATEGY.md` |
| Strategy docs | `*_STRATEGY.md` | `PRODUCT_STRATEGY.md` |
| API specs | `*_API.md` | `OKR_API.md` |
| User journeys | `*_JOURNEY.md` | `CONSULTANT_JOURNEY.md` |
| Handoffs | `[DATE]_handoff.md` | `2026-01-08_handoff.md` |

### Folder Names

- Use lowercase with hyphens: `user-journeys/`
- Or UPPERCASE for category folders: `1-OPERATIONS/`

### Author Naming Convention (BRAMHI_LABS)

| Role | Author Name | Use For |
|------|-------------|---------|
| Product Manager | `BRAMHI_LABS_ARIA_PM` | Product docs, user journeys |
| Architect | `BRAMHI_LABS_SYNTH_ARCH` | Architecture docs |
| Developer | `BRAMHI_LABS_CODEX_DEV` | Implementation docs |
| QA | `BRAMHI_LABS_VALIDAR_QA` | Testing docs |
| Consultant | `BRAMHI_LABS_CONSULTANT` | Session management |

---

## Required Document Sections

Every new `.md` file MUST include:

```markdown
# [Document Title]

**Version**: X.Y.Z
**Last Updated**: [Date]
**Status**: [Draft/Active/Deprecated]
**Owner**: [Team/Role]

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Date | Name | Initial version |

---

[Content]

---

## Related Documents

- [Link 1](path)

---

**Document Status**: [Description]
```

---

## After Creating a New Document

1. **Add to DOCUMENT_REGISTRY.md**: `.claude/DOCUMENT_REGISTRY.md`
2. **Update parent README.md**: Add link to new document
3. **Update CHANGE_LOG.md**: `.claude/CHANGE_LOG.md`
4. **Update cross-references**: Link from related documents

---

## Prohibited Actions

- **DO NOT** create `.md` files in root folder
- **DO NOT** create files in `KARVIA_STRATEGY/` root
- **DO NOT** create random folders
- **DO NOT** skip the document header template
- **DO NOT** forget to update DOCUMENT_REGISTRY

---

## Related Documents

- [DOCUMENT_STANDARDS.md](./DOCUMENT_STANDARDS.md) - Document governance
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Quality standards
- [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) - Document index

---

**Document Status**: Mandatory file placement guide. All contributors must follow these rules.
