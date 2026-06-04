# KARVIA Engine Vision

<!-- @GENOME T1-KRV-001 | ACTIVE | 2026-04-05 | parent:ROOT | auto:/strategy,/coding | linked:/init,/audit -->

**Version**: 1.0
**Created**: April 5, 2026
**Status**: ACTIVE
**Owner**: CTO

---

## What is KARVIA?

**KARVIA is the OKR engine** - the invisible infrastructure that powers goal-setting and execution for service businesses. It is NOT the user-facing product.

> "KARVIA powers the goals. YSELA powers the transformation."

---

## The Engine Principle

```
┌─────────────────────────────────────────────────────────────────┐
│  Users see YSELA                                                │
│  "YSELA helps me achieve my business goals"                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                    (wraps and presents)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  KARVIA powers everything                                       │
│  • Data models (Objectives, Key Results, Goals, Tasks)          │
│  • APIs (RESTful endpoints)                                     │
│  • Authentication (JWT, RBAC)                                   │
│  • Multi-tenancy (company isolation)                            │
│  • Microservices (IAM, Assessment, Planner, Scoring)            │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight**: KARVIA is like the engine in a car - essential, powerful, but invisible to the driver. The driver interacts with the steering wheel (YSELA), not the engine (KARVIA).

---

## Engine Vision Statement

**KARVIA will be the most reliable, extensible OKR engine for B2B SaaS products** - enabling any product layer to deliver goal-setting, progress tracking, and team collaboration features without reinventing the infrastructure.

---

## What KARVIA Does

### 1. OKR Data Management

KARVIA manages the complete objective hierarchy:

```
Company (Multi-tenant root)
  │
  ├── Objectives (4 per year, annual business goals)
  │   │
  │   └── Key Results (3-5 per objective, measurable outcomes)
  │       │
  │       └── Goals (Quarterly → Weekly, time-boxed targets)
  │           │
  │           └── Tasks (Daily execution items)
  │
  ├── Teams (Departments, divisions)
  │
  └── Users (Role-based: CONSULTANT → BUSINESS_OWNER → EXECUTIVE → MANAGER → EMPLOYEE)
```

### 2. Assessment System (SSI)

The Speed-Strength-Intelligence framework:

| Dimension | Measures | Blocks |
|-----------|----------|--------|
| **Speed** | Execution, decisions, change, response | B1-B4 |
| **Strength** | Operations, financial, people, market | B5-B8 |
| **Intelligence** | Data, learning, innovation, connection | B9-B12 |

### 3. Multi-Tenant Architecture

| Capability | Implementation |
|------------|----------------|
| Data isolation | All queries filter by `company_id` |
| Role hierarchy | CONSULTANT > BUSINESS_OWNER > EXECUTIVE > MANAGER > EMPLOYEE |
| Tenant context | Middleware validates company ownership |
| Cross-tenant prevention | Security tests validate isolation (26 tests) |

### 4. AI Integration

| Feature | Status |
|---------|--------|
| OKR generation from SSI | ACTIVE |
| AIContextService | ACTIVE |
| Prompt template system | ACTIVE |
| LLM interaction logging | ACTIVE |

---

## What KARVIA Does NOT Do

| Not This | Owner |
|----------|-------|
| User-facing copy and language | YSELA |
| Behavior frameworks (BBB, GRIT) | YSELA |
| Gamification (PBL) | YSELA |
| Coach persona | YSELA |
| ML predictions | iBrain (future) |
| Behavioral nudges | iBrain (future) |

---

## Engine Capabilities (v1.0)

The KARVIA 1.0 baseline includes:

| Category | Capabilities |
|----------|--------------|
| **Authentication** | JWT tokens, role-based access, session management |
| **Multi-Tenancy** | Company isolation, tenant context, cross-tenant prevention |
| **OKR Hierarchy** | Objectives, Key Results, Goals (Quarterly/Weekly), Tasks |
| **Assessment** | SSI framework, 12-block MECE scoring, industry presets |
| **Teams** | CRUD, membership, department structure |
| **AI** | OKR generation, context building, prompt templates |
| **Planning** | Weekly/quarterly planning, task generation |

**Test Coverage**: 1,491 tests (98% pass rate)

For detailed capabilities, see [KARVIA_1.0_CAPABILITIES.md](../1-PRODUCT/KARVIA_1.0_CAPABILITIES.md).

---

## Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Main Express API Server                       │
│                    (server/ - Port 5000)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
    ┌──────────┬───────────┼───────────┬───────────┬──────────────┐
    │          │           │           │           │              │
┌───▼───┐  ┌───▼───┐  ┌────▼────┐  ┌───▼────┐  ┌───▼────┐  ┌─────▼─────┐
│  IAM  │  │Assess │  │ Planner │  │Scoring │  │Observer│  │ Tracking  │
│ :8081 │  │ :8082 │  │  :8083  │  │ :8084  │  │ :8085  │  │  :8086    │
└───────┘  └───────┘  └─────────┘  └────────┘  └────────┘  └───────────┘
  ACTIVE     ACTIVE      ACTIVE      ACTIVE     STANDBY      STANDBY
```

---

## Relationship to YSELA

YSELA is the **product layer** that wraps KARVIA:

| Layer | What It Is | User Sees? |
|-------|------------|------------|
| **YSELA** | Product brand, UX, behavior frameworks | Yes - this is the product |
| **KARVIA** | OKR engine, APIs, data models | No - invisible infrastructure |
| **iBrain** | AI/ML intelligence (future) | No - behind the scenes |

**Integration Pattern**:
1. YSELA UI calls KARVIA APIs
2. KARVIA processes data and returns results
3. YSELA presents results with behavior language

For product vision, see [YSELA_PRODUCT_VISION.md](./YSELA_PRODUCT_VISION.md).

---

## Relationship to iBrain

iBrain is the **intelligence layer** (future integration):

| Flow | Direction | Purpose |
|------|-----------|---------|
| Telemetry | KARVIA → iBrain | Events, metrics, patterns |
| Nudges | iBrain → KARVIA | Behavioral interventions |
| Predictions | iBrain → KARVIA | Risk, momentum, engagement |

**Beta Status**: iBrain NOT connected (standalone mode)

For integration details, see [iBRAIN_Integration/](../../iBRAIN_Integration/).

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18.x |
| Framework | Express 4.18 |
| Database | MongoDB 6.x (Atlas) |
| Auth | JWT with RBAC guards |
| AI | OpenAI GPT-4 |
| Hosting | Render.com (PaaS) |

---

## Extensibility

KARVIA is designed to power multiple products:

```
Current State (Beta)        Future State
━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━
┌──────────┐                ┌──────────┐ ┌──────────┐ ┌──────────┐
│  YSELA   │                │  YSELA   │ │  HRMS    │ │  CRM     │
└────┬─────┘                └────┬─────┘ └────┬─────┘ └────┬─────┘
     │                           │            │            │
     ▼                           └────────────┼────────────┘
┌──────────┐                                  │
│  KARVIA  │                           ┌──────▼──────┐
│ (Engine) │                           │   KARVIA    │
└──────────┘                           │  (Shared)   │
                                       └─────────────┘
```

**The LEGO Principle**: Any product layer can be swapped while keeping the engine.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| API availability | 99.9% uptime |
| Response time | P95 < 200ms |
| Test coverage | > 95% pass rate |
| Security | Zero data leaks |
| Scalability | Support 1000+ companies |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [YSELA_PRODUCT_VISION.md](./YSELA_PRODUCT_VISION.md) | Product layer vision |
| [KARVIA_1.0_CAPABILITIES.md](../1-PRODUCT/KARVIA_1.0_CAPABILITIES.md) | Engine capabilities |
| [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) | Three-layer model |
| [PRODUCT_ARCHITECTURE.md](../1-PRODUCT/PRODUCT_ARCHITECTURE.md) | Technical architecture |

---

**Vision Owner**: CTO
**Created**: April 5, 2026
**Status**: Active
