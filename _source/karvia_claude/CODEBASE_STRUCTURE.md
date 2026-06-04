# KARVIA Business - Codebase Structure

<!-- @GENOME T2-ARC-004 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/strategy -->

**Version**: 1.0.0
**Last Updated**: January 8, 2026
**Status**: Active
**Owner**: BRAMHI_LABS

---

## Purpose

Map of the KARVIA Business codebase for quick navigation and context.

---

## Root Directory Structure

```
karvia_business/
│
├── .claude/                   # Claude AI session management
├── .env*                      # Environment configurations
├── .git/                      # Git repository
│
├── KARVIA_STRATEGY/           # Product & technical strategy docs
├── Karvia_OKR_Mockups/        # UI mockups and designs
├── Karvia_OKR_Product_Planning/  # Sprint planning & tasks
│
├── client/                    # Frontend React application
├── server/                    # Backend Node.js/Express API
├── engines/                   # Microservice engines
│
├── docs/                      # Additional documentation
├── scripts/                   # Utility scripts
├── tests/                     # Test suites
│
├── bramhi/                    # Legacy framework folder
├── config/                    # Configuration files
├── infrastructure/            # Infrastructure configs
├── kubernetes/                # K8s manifests
├── nginx/                     # Nginx configs
├── templates/                 # Email/notification templates
│
├── package.json               # Node.js dependencies
├── docker-compose.yml         # Docker orchestration
├── playwright.config.ts       # E2E test config
└── README.md                  # Project readme
```

---

## Client (Frontend)

```
client/
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── assessment/        # Assessment components
│   │   ├── dashboard/         # Dashboard views
│   │   ├── okr/               # OKR management
│   │   ├── planning/          # AI planning
│   │   └── shared/            # Shared components
│   │
│   ├── pages/                 # Route pages
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API service layer
│   ├── store/                 # State management
│   ├── utils/                 # Utility functions
│   └── App.jsx                # Main app component
│
├── package.json
└── vite.config.js
```

---

## Server (Backend)

```
server/
├── config/                    # Server configuration
├── controllers/               # Route controllers
├── middleware/                # Express middleware
├── models/                    # Mongoose models
├── routes/                    # API routes
├── services/                  # Business logic
├── utils/                     # Utility functions
├── validators/                # Input validation
└── index.js                   # Entry point
```

---

## Engines (Microservices)

```
engines/
├── assessment/                # Assessment engine (8082)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── iam/                       # IAM/Auth engine (8081)
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── services/
│
├── planner/                   # OKR Planner engine (8083)
│   ├── controllers/
│   ├── routes/
│   └── services/
│
├── observer/                  # Observer engine (8085)
├── scoring/                   # Scoring engine (8084)
└── shared/                    # Shared utilities
```

---

## Port Allocation

| Service | Port | Status |
|---------|------|--------|
| Main API Server | 8080 | Required |
| IAM Engine | 8081 | Required |
| Assessment Engine | 8082 | Required |
| Planner Engine | 8083 | Required |
| Scoring Engine | 8084 | Optional |
| Observer Engine | 8085 | Optional |
| Client (Dev) | 3000 | Dev only |

---

## Key Files

| File | Purpose |
|------|---------|
| `server/index.js` | Main server entry point |
| `client/src/App.jsx` | Main React app |
| `engines/iam/index.js` | IAM engine entry |
| `package.json` | Dependencies & scripts |
| `.env` | Environment variables |
| `docker-compose.yml` | Docker orchestration |

---

## Database Models

| Model | Location | Purpose |
|-------|----------|---------|
| User | `server/models/User.js` | User accounts |
| Company | `server/models/Company.js` | Organizations |
| Team | `server/models/Team.js` | Team structure |
| Objective | `server/models/Objective.js` | OKR objectives |
| KeyResult | `server/models/KeyResult.js` | Key results |
| Assessment | `server/models/Assessment.js` | SSI assessments |
| Invitation | `server/models/Invitation.js` | Survey invitations |

---

## Related Documents

- [DATA_STRUCTURE.md](./DATA_STRUCTURE.md) - Documentation structure
- [1-OPERATIONS/ENGINE_STATUS.md](./1-OPERATIONS/MONITORING/ENGINE_STATUS.md) - Engine health

---

**Document Status**: Active codebase map for KARVIA Business.
