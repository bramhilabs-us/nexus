# KARVIA Business - Documentation Structure

<!-- @GENOME T2-ARC-005 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/strategy | linked:/coding -->

**Version**: 1.0.0
**Last Updated**: January 8, 2026
**Status**: Active
**Owner**: BRAMHI_LABS

---

## Purpose

Map of documentation and data organization in KARVIA Business.

---

## Documentation Structure

```
karvia_business/
│
├── .claude/                       # Claude AI Documentation (45+ files)
│   ├── Core Governance            # README, MASTER_GUIDE, etc.
│   ├── commands/                  # Slash commands
│   ├── templates/                 # Document templates
│   ├── sessions/                  # Session management
│   ├── bramhi/                    # Framework files
│   ├── 1-OPERATIONS/              # Operations docs
│   ├── 2-DEVELOPMENT/             # Development docs
│   └── 3-CLAUDE_AI/               # Claude tools
│
├── KARVIA_STRATEGY/               # Product Strategy (Main)
│   ├── 1-PRODUCT/
│   │   ├── strategy/              # Product strategy docs
│   │   ├── user-journeys/         # User persona journeys
│   │   └── user-stories/          # Product requirements
│   ├── 2-TECHNICAL/
│   │   ├── architecture/          # System architecture
│   │   ├── api-specs/             # API specifications
│   │   └── data-models/           # Database schemas
│   └── 3-DELIVERY/
│       ├── sprints/               # Sprint plans
│       ├── releases/              # Release notes
│       └── handoffs/              # Session handoffs
│
├── Karvia_OKR_Product_Planning/   # Sprint Planning
│   ├── sprints/                   # Sprint documents
│   ├── epics/                     # Epic specifications
│   └── retrospectives/            # Sprint retros
│
├── Karvia_OKR_Mockups/            # UI Design
│   ├── wireframes/                # Wireframe files
│   └── components/                # Component designs
│
└── docs/                          # Legacy Documentation
    ├── api/                       # API docs
    ├── deployment/                # Deployment guides
    └── architecture/              # Architecture docs
```

---

## Documentation Tiers

| Tier | Location | Purpose |
|------|----------|---------|
| T1 - Constitutional | `.claude/bramhi/` | Framework governance |
| T2 - Canonical | `KARVIA_STRATEGY/` | Strategy source of truth |
| T3 - Derived | `Karvia_OKR_*/` | Sprint/implementation docs |
| T4 - Working | `docs/` | Drafts, notes |
| Ops | `.claude/sessions/` | Session handoffs |

---

## Key Documentation Files

### Strategy

| File | Location | Purpose |
|------|----------|---------|
| PRODUCT_STRATEGY.md | KARVIA_STRATEGY/1-PRODUCT/ | Product vision |
| TECHNICAL_ARCHITECTURE.md | KARVIA_STRATEGY/2-TECHNICAL/ | System design |
| CURRENT_SPRINT.md | KARVIA_STRATEGY/3-DELIVERY/ | Active sprint |

### Operations

| File | Location | Purpose |
|------|----------|---------|
| PRODUCTION_GUIDE.md | .claude/1-OPERATIONS/ | Deployment guide |
| ENGINE_STATUS.md | .claude/1-OPERATIONS/ | Engine health |
| CLAUDE_CHECKLIST.md | .claude/1-OPERATIONS/ | Quality gates |

### Development

| File | Location | Purpose |
|------|----------|---------|
| LOCAL_DEVELOPMENT_CHECKLIST.md | .claude/2-DEVELOPMENT/ | Local setup |
| CODE_STANDARDS.md | .claude/2-DEVELOPMENT/ | Coding standards |

---

## Data Models (MongoDB)

### Core Entities

```
User
├── _id: ObjectId
├── email: String
├── name: String
├── role: Enum [admin, consultant, employee]
├── company: ObjectId → Company
└── team: ObjectId → Team

Company
├── _id: ObjectId
├── name: String
├── industry: String
├── employees: [ObjectId → User]
└── settings: Object

Team
├── _id: ObjectId
├── name: String
├── company: ObjectId → Company
├── manager: ObjectId → User
└── members: [ObjectId → User]
```

### OKR Entities

```
Objective
├── _id: ObjectId
├── title: String
├── description: String
├── owner: ObjectId → User
├── team: ObjectId → Team
├── quarter: String
├── keyResults: [ObjectId → KeyResult]
└── status: Enum [draft, active, completed]

KeyResult
├── _id: ObjectId
├── title: String
├── objective: ObjectId → Objective
├── targetValue: Number
├── currentValue: Number
├── unit: String
└── progress: Number (0-100)
```

### Assessment Entities

```
Assessment
├── _id: ObjectId
├── type: Enum [SSI, VALUE]
├── user: ObjectId → User
├── responses: [Object]
├── scores: Object
├── completedAt: Date
└── status: Enum [pending, completed]

Invitation
├── _id: ObjectId
├── assessment: ObjectId → Assessment
├── invitee: Email/ObjectId
├── expiresAt: Date
└── status: Enum [pending, completed, expired]
```

---

## API Structure

### Endpoints by Domain

| Domain | Base Path | Auth |
|--------|-----------|------|
| Auth | `/api/auth` | Public |
| Users | `/api/users` | JWT |
| Companies | `/api/companies` | JWT + Admin |
| Teams | `/api/teams` | JWT |
| Objectives | `/api/objectives` | JWT |
| KeyResults | `/api/key-results` | JWT |
| Assessments | `/api/assessments` | JWT |
| Planning | `/api/planning` | JWT |
| Admin | `/api/admin` | JWT + Admin |

---

## Related Documents

- [CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md) - Code organization
- [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) - Document index

---

**Document Status**: Active documentation map for KARVIA Business.
