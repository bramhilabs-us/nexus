# Two-Product Gap Analysis

**Created**: April 3, 2026
**Purpose**: Identify what product artifacts YSELA and KARVIA each need
**Context**: KARVIA is becoming a reusable engine; YSELA is the user-facing product

---

## The Two-Product Reality

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ECOSYSTEM VIEW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        YSELA                                     │    │
│  │                   (Product Layer)                                │    │
│  │                                                                   │    │
│  │  "The behavior transformation platform that helps SMBs           │    │
│  │   achieve their goals through habit change, not just goal        │    │
│  │   setting."                                                       │    │
│  │                                                                   │    │
│  │  Target: Business users (Consultants, Executives, Employees)     │    │
│  │  Experience: Coach-guided, gamified, behavior-focused            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              │ powered by                                │
│                              ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        KARVIA                                    │    │
│  │                   (Engine Layer)                                 │    │
│  │                                                                   │    │
│  │  "The reusable OKR engine that provides data models, APIs,       │    │
│  │   and microservices for goal management platforms."              │    │
│  │                                                                   │    │
│  │  Target: Product teams (Internal, Partners, White-label)         │    │
│  │  Interface: APIs, Data models, Microservices                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Product Artifact Requirements

### Standard Product Artifacts

Every product needs:

| Artifact | Purpose | Audience |
|----------|---------|----------|
| **Vision** | Why we exist, where we're going | All stakeholders |
| **Philosophy** | Core beliefs, principles | Team, partners |
| **Strategy** | How we win, positioning | Leadership |
| **User Journeys** | How users experience the product | UX, Product |
| **User Stories** | What we build | Engineering |
| **Backlog** | What's prioritized | Product, Engineering |
| **Roadmap** | When we deliver | All stakeholders |

---

## YSELA Product Artifacts

### Current State

| Artifact | Status | Location | Quality |
|----------|--------|----------|---------|
| Vision | **MISSING** | - | - |
| Philosophy | EXISTS | Buried in Beta folder | Excellent |
| Strategy | PARTIAL | Mixed in strategy/ | Needs extraction |
| User Journeys | **MISSING** | - | - |
| User Stories | **MISSING** | - | - |
| Backlog | **MISSING** | - | - |
| Roadmap | EXISTS | Beta roadmap | Good |
| UX Principles | EXISTS | Buried in Beta folder | Excellent |
| Gamification | EXISTS | Buried in Beta folder | Excellent |
| Coach Persona | EXISTS | Buried in Prompts folder | Good |
| Methodology | EXISTS | Buried in Beta folder | Excellent |

### What YSELA Needs

```
YSELA/                                    ← TO CREATE
│
├── vision/
│   └── YSELA_VISION.md                   ← TO CREATE
│       • Why YSELA exists
│       • What problem it solves for users
│       • Where YSELA is going
│       • How YSELA is different
│
├── philosophy/                            ← MOVE existing files
│   ├── YSELA_PHILOSOPHY.md               ← Move (exists)
│   ├── BBB_FRAMEWORK.md                  ← Move (exists)
│   └── (supporting research)             ← Move (exists)
│
├── strategy/
│   └── YSELA_STRATEGY.md                 ← TO CREATE
│       • Target market (SMB consultants)
│       • Go-to-market approach
│       • Competitive positioning
│       • Pricing strategy
│
├── user-journeys/                         ← TO CREATE
│   ├── CONSULTANT_YSELA_JOURNEY.md       ← TO CREATE
│   │   "How a consultant EXPERIENCES guiding clients through YSELA"
│   ├── BUSINESS_OWNER_YSELA_JOURNEY.md   ← TO CREATE
│   │   "How an owner EXPERIENCES behavior transformation"
│   └── EMPLOYEE_YSELA_JOURNEY.md         ← TO CREATE
│       "How an employee EXPERIENCES the coach and gamification"
│
├── user-stories/
│   └── YSELA_USER_STORIES.md             ← TO CREATE
│       • Stories focused on experience, not features
│       • "As a user, I feel encouraged when..."
│       • "As a coach, I can guide users by..."
│
├── backlog/
│   └── YSELA_BACKLOG.md                  ← TO CREATE
│       • Experience improvements
│       • Coach enhancements
│       • Gamification features
│       • Behavior framework expansions
│
├── experience/                            ← MOVE existing files
│   ├── UX_PRINCIPLES.md                  ← Move (exists)
│   ├── PBL_GAMIFICATION.md               ← Move (exists)
│   ├── COACH_PERSONA.md                  ← Move (exists)
│   └── USER_JOURNEY_SIMULATION.md        ← Move (exists)
│
├── methodology/                           ← MOVE existing files
│   └── CONSULTANT_METHODOLOGY.md         ← Move (exists)
│
├── mockups/                               ← MOVE existing folder
│   └── (Beta mockups)                    ← Move (exists)
│
└── roadmap/
    └── (links to delivery in KARVIA_STRATEGY)
```

### YSELA Gap Summary

| Gap | Priority | Effort | Owner |
|-----|----------|--------|-------|
| Create YSELA_VISION.md | P1 | Medium | CPO |
| Create YSELA user journeys (3) | P1 | Large | CPO |
| Create YSELA_STRATEGY.md | P2 | Medium | CPO |
| Create YSELA user stories | P2 | Large | CPO |
| Create YSELA backlog | P2 | Medium | CPO |
| Move existing YSELA files (10+1) | P0 | Small | CTO |

---

## KARVIA Engine Artifacts

### Current State

| Artifact | Status | Location | Quality |
|----------|--------|----------|---------|
| Vision | EXISTS | PRODUCT_VISION.md | Good |
| Engine Philosophy | **PARTIAL** | Mixed in philosophy docs | Needs extraction |
| Architecture | EXISTS | PRODUCT_ARCHITECTURE.md | Excellent |
| User Journeys | EXISTS | user-journeys/ | Good (system journeys) |
| User Stories | EXISTS | user-stories/ | Excellent |
| Backlog | EXISTS | MASTER_PRODUCT_BACKLOG.md | Needs cleanup |
| Roadmap | EXISTS | MVP_ROADMAP/ | Good |
| API Specs | EXISTS | 2-TECHNICAL/ | Excellent |
| Data Models | EXISTS | 2-TECHNICAL/ | Excellent |

### What KARVIA Needs

```
KARVIA_STRATEGY/
│
├── 1-PRODUCT/
│   ├── PRODUCT_VISION.md                 ✓ EXISTS (KARVIA business)
│   ├── PRODUCT_ARCHITECTURE.md           ✓ EXISTS (engine architecture)
│   │
│   ├── KARVIA_ENGINE_PHILOSOPHY.md       ← TO CREATE
│   │   • Engine design principles
│   │   • Modularity philosophy
│   │   • Multi-tenancy approach
│   │   • Extensibility patterns
│   │   • "LEGO principle" for engines
│   │
│   ├── user-journeys/                    ✓ EXISTS (system journeys)
│   │   • Describes how users interact with FEATURES
│   │   • Rename to "System Journeys" for clarity?
│   │
│   ├── user-stories/                     ✓ EXISTS
│   │   • Technical requirements
│   │   • Feature specifications
│   │
│   ├── strategy/                         ✓ EXISTS (needs cleanup)
│   │   • Remove YSELA-specific content
│   │   • Focus on engine capabilities
│   │
│   └── backlog/
│       └── MASTER_PRODUCT_BACKLOG.md     ⚠️ NEEDS CLEANUP
│           • Remove YSELA experience items
│           • Keep engine/technical items
│
├── 2-TECHNICAL/                          ✓ EXISTS (all engine specs)
│
└── 3-DELIVERY/                           ✓ EXISTS (delivery is neutral)
```

### KARVIA Gap Summary

| Gap | Priority | Effort | Owner |
|-----|----------|--------|-------|
| Create KARVIA_ENGINE_PHILOSOPHY.md | P2 | Medium | CTO |
| Cleanup strategy/ (remove YSELA content) | P2 | Small | CTO |
| Cleanup backlog (remove YSELA items) | P2 | Small | CTO |
| Rename user-journeys to "System Journeys"? | P3 | Small | CTO |

---

## The Relationship Model

### How YSELA and KARVIA Relate

```
YSELA User Journey                    KARVIA System Journey
────────────────────                  ─────────────────────
"User opens app"                      → GET /api/dashboard
"Coach greets with insight"           → AI generates guidance block
"User sees top priority"              → GET /api/objectives (filtered)
"User celebrates yesterday's win"     → Points calculated, badge checked
"Coach suggests next move"            → AI generates task suggestion
"User marks move complete"            → PUT /api/tasks/:id/complete
"Points animate, streak updates"      → Progress cascade, gamification update
"Coach encourages next step"          → AI generates motivation message
```

### Documentation Linking

```
YSELA/user-journeys/EMPLOYEE_JOURNEY.md
│
├── Step: "User sees their dashboard"
│   └── Links to: KARVIA_STRATEGY/.../EMPLOYEE_JOURNEY.md#dashboard
│
├── Step: "Coach celebrates completion"
│   └── Links to: KARVIA_STRATEGY/.../api-specification/gamification.yaml
│
└── Step: "Points animation plays"
    └── Links to: server/services/gamificationService.js
```

---

## Backlog Split Proposal

### Option A: Two Separate Backlogs

```
YSELA/backlog/YSELA_BACKLOG.md
├── Experience improvements
├── Coach personality updates
├── Gamification enhancements
└── Behavior framework items

KARVIA_STRATEGY/1-PRODUCT/backlog/KARVIA_BACKLOG.md
├── API enhancements
├── Performance improvements
├── Technical debt
└── Engine feature additions
```

### Option B: Single Backlog with Tags

```
MASTER_PRODUCT_BACKLOG.md
├── [YSELA] Coach greeting improvement
├── [KARVIA] API pagination enhancement
├── [YSELA] New badge type: "Momentum Master"
├── [KARVIA] Redis caching for dashboard
├── [BOTH] Weekly reflection feature
```

**Recommendation**: Option A for clarity. Two products = two backlogs.

---

## User Journey Distinction

### KARVIA System Journeys (Existing)

**Focus**: What the system does, feature by feature

**Example (Employee)**:
1. Employee logs into system
2. Dashboard shows assigned tasks
3. Employee clicks task to view details
4. Employee updates progress percentage
5. System recalculates goal progress
6. System updates parent KR

**Audience**: Engineering, QA, Product implementation

### YSELA Experience Journeys (TO CREATE)

**Focus**: What the user feels, moment by moment

**Example (Employee)**:
1. Sarah opens YSELA after her morning coffee
2. The Coach greets her: "Great job on those 3 calls yesterday!"
3. Her momentum streak shows "5 days" with a flame icon
4. The Coach suggests: "Ready for your next move? How about following up with Michael?"
5. Sarah completes the call in 10 minutes
6. Confetti animation! "+15 points, Momentum maintained!"
7. Coach: "You're on fire! One more move before lunch?"

**Audience**: UX, Product vision, Customer success

---

## Action Items Summary

### Immediate (Sprint 21-22)

| Task | Priority | Owner | Effort |
|------|----------|-------|--------|
| Create YSELA/ folder structure | P0 | CTO | S |
| Move 10 YSELA files + mockups | P0 | CTO | S |
| Create YSELA/README.md | P0 | CTO | S |
| Create YSELA_VISION.md | P1 | CPO | M |
| Create YSELA user journeys (3) | P1 | CPO | L |

### Short-term (Sprint 22-23)

| Task | Priority | Owner | Effort |
|------|----------|-------|--------|
| Create YSELA_STRATEGY.md | P2 | CPO | M |
| Create YSELA_BACKLOG.md | P2 | CPO | M |
| Create KARVIA_ENGINE_PHILOSOPHY.md | P2 | CTO | M |
| Cleanup KARVIA backlog | P2 | CTO | S |
| Review/split 10 mixed documents | P2 | Both | L |

### Medium-term (Sprint 23+)

| Task | Priority | Owner | Effort |
|------|----------|-------|--------|
| Create YSELA user stories | P3 | CPO | L |
| Update all cross-references | P3 | CTO | M |
| Create ecosystem navigation diagram | P3 | Both | S |

---

## Decision Points for Discussion

1. **Backlog**: Single with tags or two separate?
2. **User Journeys**: Rename KARVIA journeys to "System Journeys"?
3. **Strategy Docs**: Extract YSELA content or duplicate?
4. **Mockups**: Move or copy (keep originals)?
5. **Roadmap**: How to handle intertwined Beta roadmap?

---

**Recommendation**: Start with the clear wins (move files, create structure), then tackle the ambiguous items.
