# ECOSYSTEM ARCHITECTURE

<!-- @GENOME T1-ARC-001 | ACTIVE | 2026-04-06 | parent:ROOT | auto:/strategy,/init | linked:/coding,/design -->

> The definitive guide to the three-layer product ecosystem: **iBrain** (Intelligence) → **YSELA** (Product) → **KARVIA** (Engine)

**Version**: 1.1
**Last Updated**: 2026-04-05
**Status**: ACTIVE - Beta Phase (Apr 17, 2026)

---

## Quick Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER EXPERIENCE                                │
│                     "I use YSELA to run my business"                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  ███████╗ ██╗   ██╗ ███████╗ ██╗      █████╗                            │
│  ██╔════╝ ╚██╗ ██╔╝ ██╔════╝ ██║     ██╔══██╗   PRODUCT LAYER          │
│  ███████╗  ╚████╔╝  ███████╗ ██║     ███████║   • User-facing brand    │
│  ╚════██║   ╚██╔╝   ╚════██║ ██║     ██╔══██║   • Behavior frameworks  │
│  ███████║    ██║    ███████║ ███████╗██║  ██║   • Coaching persona     │
│  ╚══════╝    ╚═╝    ╚══════╝ ╚══════╝╚═╝  ╚═╝   • BBB, GRIT, PBL       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    Wraps (presents data via behavior lens)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  ██╗  ██╗  █████╗  ██████╗  ██╗   ██╗ ██╗  █████╗                       │
│  ██║ ██╔╝ ██╔══██╗ ██╔══██╗ ██║   ██║ ██║ ██╔══██╗   ENGINE LAYER      │
│  █████╔╝  ███████║ ██████╔╝ ██║   ██║ ██║ ███████║   • OKR backbone    │
│  ██╔═██╗  ██╔══██║ ██╔══██╗ ╚██╗ ██╔╝ ██║ ██╔══██║   • Data models     │
│  ██║  ██╗ ██║  ██║ ██║  ██║  ╚████╔╝  ██║ ██║  ██║   • APIs & engines  │
│  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝   ╚═══╝   ╚═╝ ╚═╝  ╚═╝   • Multi-tenant    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    Powers (provides data & execution)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  ██╗ ██████╗  ██████╗   █████╗  ██╗ ███╗   ██╗                          │
│  ██║ ██╔══██╗ ██╔══██╗ ██╔══██╗ ██║ ████╗  ██║   INTELLIGENCE LAYER    │
│  ██║ ██████╔╝ ██████╔╝ ███████║ ██║ ██╔██╗ ██║   • ML engines          │
│  ██║ ██╔══██╗ ██╔══██╗ ██╔══██║ ██║ ██║╚██╗██║   • Behavioral AI       │
│  ██║ ██████╔╝ ██║  ██║ ██║  ██║ ██║ ██║ ╚████║   • Pattern detection   │
│  ╚═╝ ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝ ╚═╝  ╚═══╝   • Predictions         │
│                                                   (FUTURE INTEGRATION)  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Layer Definitions

### 1.1 YSELA (Product Layer)

**What it is**: The user-facing brand and behavior transformation wrapper.

**What users see**: "YSELA helps me build habits that grow my business."

**Core Frameworks**:
| Framework | Full Name | Purpose |
|-----------|-----------|---------|
| **BBB** | Behavior-Based Business | Business goals through habit formation |
| **GRIT** | Growth-Reinforce-Invest-Trigger | Engagement loop methodology |
| **PBL** | Points-Badges-Leaderboards | Gamification system |
| **Football Match** | Daily/Weekly Sprint Model | Execution cadence |
| **Coaching Kata** | YSELA Coach Persona | AI coaching methodology |

**YSELA owns**:
- All user-facing copy, prompts, and personas
- Behavior change narratives
- Gamification presentation
- Coach personality and tone
- Progress celebration language

**YSELA does NOT own**:
- Data models (owned by KARVIA)
- API endpoints (owned by KARVIA)
- ML predictions (owned by iBrain)

**Key Documents**:
- [YSELA_PRODUCT_VISION.md](KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md) - T1 product vision summary
- [YSELA_VISION.md](YSELA/vision/YSELA_VISION.md) - Detailed YSELA vision
- [YSELA_PHILOSOPHY.md](YSELA/philosophy/YSELA_PHILOSOPHY.md) - Core philosophy

---

### 1.2 KARVIA (Engine Layer)

**What it is**: The invisible OKR backbone that powers execution.

**What it does**: Manages the Objective → Key Result → Goal → Task hierarchy.

**Core Components**:
```
KARVIA Engine Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────────────────────────────────┐
│                    Main Express API Server                       │
│                    (server/ - Port 5000)                        │
│  • Authentication & Authorization (JWT)                          │
│  • Multi-tenant data isolation (company_id)                     │
│  • RESTful API endpoints                                        │
│  • Graceful degradation with feature flags                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
    ┌──────────┬───────────┼───────────┬───────────┬──────────────┐
    │          │           │           │           │              │
┌───▼───┐  ┌───▼───┐  ┌────▼────┐  ┌───▼────┐  ┌───▼────┐  ┌─────▼─────┐
│  IAM  │  │Assess │  │ Planner │  │Scoring │  │Observer│  │ Tracking  │
│ :8081 │  │ :8082 │  │  :8083  │  │ :8084  │  │ :8085  │  │  :8086    │
└───────┘  └───────┘  └─────────┘  └────────┘  └────────┘  └───────────┘
```

**Data Model Hierarchy**:
```javascript
Company (Multi-tenant root)
  ├── Assessment (SSI: Speed, Strength, Intelligence)
  ├── Objectives (Annual - max 4)
  │   └── Key Results (Quarterly - 3-5 per objective)
  │       └── Goals (Quarterly/Weekly - nested hierarchy)
  │           └── Tasks (Daily execution)
  ├── Teams (Departments/divisions)
  └── Users (CONSULTANT → BUSINESS_OWNER → EXECUTIVE → MANAGER → EMPLOYEE)
```

**KARVIA owns**:
- All database models and schemas
- All API endpoints and routes
- Authentication and authorization
- Multi-tenant isolation
- Progress calculations
- Engine microservices

**KARVIA does NOT own**:
- User-facing language (owned by YSELA)
- ML predictions (owned by iBrain)
- Behavior frameworks (owned by YSELA)

**Key Documents**:
- [KARVIA_ENGINE_VISION.md](KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md) - T1 engine vision
- [KARVIA_1.0_CAPABILITIES.md](KARVIA_STRATEGY/1-PRODUCT/KARVIA_1.0_CAPABILITIES.md) - Engine baseline
- [PRODUCT_ARCHITECTURE.md](KARVIA_STRATEGY/1-PRODUCT/PRODUCT_ARCHITECTURE.md) - Technical architecture

---

### 1.3 iBrain (Intelligence Layer)

**What it is**: The ML/AI backbone that provides behavioral intelligence.

**Status**: Future integration (not required for Beta)

**iBrain Engines** (when integrated):
| Engine | Port | Function |
|--------|------|----------|
| Scoring | 8080 | Behavioral scoring algorithms |
| Tracking | 8081 | Event and pattern tracking |
| Observer | 8082 | Behavioral pattern detection |
| IAM | 8083 | Identity (shared with KARVIA) |
| Assessment | 8084 | Advanced assessments |
| Planner | 8085 | AI planning assistance |

**Integration Approach**:
- **Control Flow**: iBrain → KARVIA (behavior nudges, predictions)
- **Telemetry Flow**: KARVIA → iBrain (events, metrics)
- **Sync Strategy**: Hybrid (real-time for nudges, batch for analytics)

**iBrain will own** (future):
- ML model training and inference
- Behavioral pattern detection
- Predictive analytics
- Personalized nudging

**Key Document**: [iBRAIN_Integration/INTEGRATION_OVERVIEW.md](iBRAIN_Integration/INTEGRATION_OVERVIEW.md)

---

## 2. The LEGO Principle

Everything in this ecosystem is designed to be **modular, swappable, and composable**.

### 2.1 Why LEGO?

```
Traditional Monolith          vs.          LEGO Architecture
━━━━━━━━━━━━━━━━━━━                       ━━━━━━━━━━━━━━━━━━
┌─────────────────┐                       ┌────┐ ┌────┐ ┌────┐
│                 │                       │YSELA│ │HRMS│ │CRM │ ← Products
│   Tightly       │                       └──┬──┘ └──┬──┘ └──┬──┘
│   Coupled       │                          │      │      │
│   Impossible    │                       ┌──▼──────▼──────▼──┐
│   to Change     │                       │     KARVIA        │ ← Engine
│                 │                       │     (Reusable)    │
└─────────────────┘                       └─────────┬─────────┘
                                                    │
                                          ┌────────▼────────┐
                                          │     iBrain      │ ← Intelligence
                                          └─────────────────┘
```

### 2.2 Composability Examples

**Current State (Beta)**:
- YSELA wraps KARVIA
- iBrain integration = disabled
- Everything runs standalone

**Future State 1** (Post-Beta):
- YSELA wraps KARVIA
- iBrain provides intelligence
- Nudges appear in YSELA via KARVIA APIs

**Future State 2** (New Product):
- HRMS wraps KARVIA
- Same engine, different presentation
- iBrain shared across products

---

## 3. Beta Configuration

For Beta launch (Apr 17, 2026), the system runs in **standalone mode**:

```
Beta Architecture
━━━━━━━━━━━━━━━━
┌─────────────────────────┐
│         YSELA           │  ← User-facing (all prompts, persona)
│  (Behavior Wrapper)     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│        KARVIA           │  ← OKR engine (all data, APIs)
│    (Standalone Mode)    │
│                         │
│  ┌─────┐ ┌─────┐ ┌────┐ │
│  │IAM  │ │Assmt│ │Plan│ │  ← Microservices
│  └─────┘ └─────┘ └────┘ │
└─────────────────────────┘
            │
            ▼
       ┌─────────┐
       │ MongoDB │  ← Persistent storage
       └─────────┘

iBrain: NOT CONNECTED (future integration)
```

**Beta Feature Flags**:
```javascript
FEATURE_IBRAIN_ENABLED = false   // No iBrain dependency
FEATURE_OPENAI_ENABLED = true    // GPT-4 for OKR generation
FEATURE_REDIS_ENABLED = false    // Optional caching
```

---

## 4. Data Flow Diagrams

### 4.1 User Creates an Objective

```
User Action                 YSELA Layer              KARVIA Layer
━━━━━━━━━━━                 ━━━━━━━━━━━              ━━━━━━━━━━━━
"I want to                  YSELA Coach:             POST /api/objectives
 increase sales"            "Let's break this        {
        │                    into a Match Plan!"      title: "...",
        │                           │                  period: "Q2",
        ▼                           │                  ...
   ┌─────────┐                      │                }
   │ Wizard  │ ──────────────────>──┼──────────────────────────>
   │  (UI)   │     (Behavior        │                      │
   └─────────┘      Framing)        ▼                      ▼
                              "Your First Half      Objective saved
                               starts NOW!"         Key Results created
                                                    Goals scaffolded
```

### 4.2 Daily Task Completion

```
User Action                 YSELA Layer              KARVIA Layer
━━━━━━━━━━━                 ━━━━━━━━━━━              ━━━━━━━━━━━━
"Done with                  YSELA Coach:             PUT /api/tasks/:id
 call follow-ups"           "Great move!"            { status: 'completed' }
        │                   "You've scored 3               │
        │                    Next Moves today!"            ▼
        ▼                           │               Progress recalculated
   ┌─────────┐                      │               Parent goal updated
   │ Task UI │ ──────────────────>──┼──────────────────────────>
   └─────────┘     (Celebration     │                      │
                    Language)       ▼                      ▼
                              Points awarded         Task → Goal → KR → Obj
                              Badge check            Progress cascade
                              Streak updated         Health status update
```

### 4.3 Future: iBrain Integration

```
Event                       KARVIA Layer             iBrain Layer
━━━━━                       ━━━━━━━━━━━━             ━━━━━━━━━━━━
Task completed              Emit telemetry           Receive event
        │                   {                        Analyze pattern
        │                     event: 'task.done',    Detect: "momentum"
        ▼                     user_id: ...,          Generate nudge
   ┌─────────┐                timestamp: ...         Return to KARVIA
   │ Webhook │ ──────────────────────────────────────────────────>
   └─────────┘                      │                      │
                                    │                      ▼
                                    │               { nudge: "You're on
                                    │                 a roll! Keep going" }
                                    │                      │
                                    ▼                      │
                              YSELA displays  <────────────┘
                              nudge to user
```

---

## 5. Responsibility Matrix

| Capability | YSELA | KARVIA | iBrain |
|------------|-------|--------|--------|
| User-facing copy | ✅ | ❌ | ❌ |
| API endpoints | ❌ | ✅ | ✅ (own) |
| Data models | ❌ | ✅ | ✅ (own) |
| Authentication | ❌ | ✅ | ❌ |
| Behavior frameworks | ✅ | ❌ | ❌ |
| Gamification logic | ✅ | ❌ | ❌ |
| Progress calculation | ❌ | ✅ | ❌ |
| ML predictions | ❌ | ❌ | ✅ |
| Behavioral nudges | ❌ | ❌ | ✅ |
| Coach persona | ✅ | ❌ | ❌ |
| Multi-tenancy | ❌ | ✅ | ❌ |

---

## 6. Integration Points

### 6.1 YSELA ↔ KARVIA (Active)

| Integration | Type | Description |
|-------------|------|-------------|
| All CRUD operations | REST API | YSELA UI calls KARVIA APIs |
| Authentication | JWT | Shared token, KARVIA validates |
| Prompts | Template | YSELA generates prompts, sends to GPT via KARVIA |
| Progress display | API | YSELA fetches, presents with behavior language |

### 6.2 KARVIA ↔ iBrain (Future)

| Integration | Type | Description |
|-------------|------|-------------|
| Telemetry | Webhook | KARVIA emits events to iBrain |
| Nudges | API | iBrain returns nudges for display |
| Scoring | API | iBrain provides behavioral scores |
| Predictions | API | iBrain predicts risk, momentum |

**See**: [iBRAIN_Integration/](iBRAIN_Integration/) for detailed integration specs.

---

## 7. File System Mapping

```
karvia_business/
├── ECOSYSTEM_ARCHITECTURE.md          ← YOU ARE HERE (T1-ARC-001)
├── CLAUDE.md                          ← Governance root (T0-GOV-001)
│
├── YSELA/                             ← YSELA Product Layer (NEW)
│   ├── README.md                      ← Navigation hub
│   ├── philosophy/
│   │   ├── YSELA_PHILOSOPHY.md        ← Core philosophy
│   │   ├── BBB_FRAMEWORK.md           ← Behavior framework
│   │   └── ...
│   ├── experience/
│   │   ├── UX_PRINCIPLES.md           ← UX design principles
│   │   ├── PBL_GAMIFICATION.md        ← Gamification spec
│   │   └── COACH_PERSONA.md           ← AI coach personality
│   ├── methodology/
│   │   └── CONSULTANT_METHODOLOGY.md  ← Consultant 4-step model
│   └── mockups/                       ← Beta design visuals
│
├── KARVIA_STRATEGY/                   ← KARVIA Engine Layer
│   ├── 1-VISION/                      ← T1 Vision Documents (NEW)
│   │   ├── KARVIA_ENGINE_VISION.md    ← Engine vision
│   │   ├── YSELA_PRODUCT_VISION.md    ← Product vision (link)
│   │   └── PRODUCT_ROADMAP.md         ← Unified roadmap
│   ├── 1-PRODUCT/
│   │   ├── PRODUCT_ARCHITECTURE.md    ← Engine architecture
│   │   ├── KARVIA_1.0_CAPABILITIES.md ← Engine baseline (NEW)
│   │   └── system-flows/              ← System flows (renamed from user-journeys)
│   ├── 2-TECHNICAL/                   ← Technical docs
│   └── 3-DELIVERY/                    ← Sprint & QA docs
│
├── iBRAIN_Integration/                ← Future ML integration
│   ├── INTEGRATION_OVERVIEW.md
│   └── ...
│
└── server/                            ← KARVIA codebase
```

---

## 8. Quick Reference

### When to use which document:

| Question | Go To |
|----------|-------|
| "How do the three layers work together?" | This document |
| "What's the KARVIA engine vision?" | [KARVIA_ENGINE_VISION.md](KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md) |
| "What's the YSELA product vision?" | [YSELA_PRODUCT_VISION.md](KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md) |
| "What's the product roadmap?" | [PRODUCT_ROADMAP.md](KARVIA_STRATEGY/1-VISION/PRODUCT_ROADMAP.md) |
| "What's the KARVIA engine architecture?" | [PRODUCT_ARCHITECTURE.md](KARVIA_STRATEGY/1-PRODUCT/PRODUCT_ARCHITECTURE.md) |
| "What's the YSELA philosophy?" | [YSELA_PHILOSOPHY.md](YSELA/philosophy/YSELA_PHILOSOPHY.md) |
| "How will iBrain integrate?" | [iBRAIN_Integration/](iBRAIN_Integration/) |
| "What's the Beta roadmap?" | [BETA_ROADMAP_2026.md](KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md) |

### Key Principles:

1. **YSELA = Presentation** - All user-facing elements
2. **KARVIA = Persistence** - All data and APIs
3. **iBrain = Prediction** - All ML/AI (future)
4. **Modular always** - Any layer can be swapped
5. **Beta = Standalone** - No iBrain dependency

---

*Last validated: 2026-03-30 | Next review: Sprint 21 Kickoff*
