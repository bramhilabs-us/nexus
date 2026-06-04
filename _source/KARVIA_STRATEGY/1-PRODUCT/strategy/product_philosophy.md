# 🌌 Karvia OKR Product Philosophy — Human + Machine Bootloader

> “Karvia turns one-off consulting into a living operating system for Speed ⚡, Strength 🛡️, and Intelligence 🧠.”

This page distills the product vision, strategy, and page-level responsibilities so any human or LLM can understand the system in one glance. Follow the links to dive deeper when you need specifics.

---

## 🌱 Origin Story
- **GoalTracker DNA:** Proven OKR patterns now elevated for B2B consulting.
- **iBrain Engine:** Acts as the living bridge between Karvia OKR and LLM copilots—tracking, scoring, assessing, and planning in real time to power the gamification layer.
- **Bramhi Agent Stack:** Multi-agent collaboration (ARIA, SYNTH, CODEX, VALIDAR) powers rapid discovery → design → build.
- **Karvia Promise:** Every workflow blends measurable outcomes with empathy, guiding each role through three meaningful actions a day.

---

## 🧠 iBrain: Intelligence-as-a-Service (IQaaS)

> "Every navy button with a lightning bolt is iBrain whispering the next right move."

### What is iBrain?

iBrain is Karvia's centralized intelligence layer—the brain that knows your company's SSI scores, objectives, team structure, and historical patterns. It powers every AI-assisted feature across the platform, transforming raw data into actionable guidance.

**Core Capabilities:**
- **Context Awareness**: Builds comprehensive company context (SSI 12-block scores, objectives, goals, team structure)
- **Intelligent Suggestions**: Recommends the right task, right KR to track, right numbers to chase
- **Learning Memory**: Tracks rejection history, user preferences, and success patterns
- **Token-Optimized**: Efficiently manages context within 8K token budget (P0→P1→P2 priority)

### Visual Identity: The iBrain Button

All iBrain-powered touchpoints share a consistent visual identity:

```
┌─────────────────────────────────────┐
│  ⚡ [Action Label]                  │
│                                     │
│  Background: Navy (#1e3a5f)         │
│  Icon: Lightning bolt (⚡)           │
│  Text: White                        │
│  Border-radius: 8px                 │
│  Shadow: subtle elevation           │
└─────────────────────────────────────┘
```

**CSS Reference:**
```css
.ibrain-button {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.3);
}
```

### iBrain Touchpoints Map

| Page | Touchpoint | What iBrain Does | Status |
|------|------------|------------------|--------|
| **SSI Results** | Generate OKRs | Creates objectives from SSI gaps | ✅ Active |
| **SSI Results** | Diagnostic Report | Generates health analysis & narratives | ✅ Active |
| **SSI Results** | Refresh Narratives | Regenerates executive summary | ✅ Active |
| **SSI Results** | Export PDF | AI-powered report generation | ✅ Active |
| **Objectives** | Generate with AI | Creates single objective from context | ✅ Active |
| **Objectives** | AI Generated filter | Shows AI-created objectives | ✅ Active |
| **Planning** | Generate Weekly Goals | Breaks KRs into actionable weekly tasks | ✅ Active |
| **Planning** | Generate AI Plan | Creates full weekly execution plan | ✅ Active |
| **Assessment** | Generate AI OKRs | Creates OKRs from assessment results | ✅ Active |
| **Business Insights** | Generate Insights | AI-powered performance analysis | ✅ Active |
| **Dashboard** | Task Suggestions | Recommends today's priority tasks | 🔮 Planned (S14) |
| **Dashboard** | KR Focus | Suggests which KRs need attention | 🔮 Planned (S14) |
| **Dashboard** | Number Guidance | Suggests target numbers to chase | 🔮 Planned (S14) |
| **Onboarding** | Guided Setup | AI-assisted company configuration | 🔮 Planned (S14) |

### iBrain Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        iBrain Engine                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 AIContextService.js                       │  │
│  │  • buildContext()      - Comprehensive company snapshot   │  │
│  │  • getContextDelta()   - Changes since last interaction   │  │
│  │  • get12BlockSSI()     - SSI dimension analysis           │  │
│  │  • getRejectionHistory() - Learning from user feedback    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────┬──────┴───────┬─────────────────────┐    │
│  │  AIObjectivePlanner │  aiOKRService  │  DiagnosticService │    │
│  │  Weekly goal gen    │  OKR generation │  SSI analysis      │    │
│  └───────────────────┴──────────────┴─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Company Context (8K tokens)                   │
│  P0: Company Profile (500) + SSI 12-Block (800) + Focus (400)   │
│  P1: Objectives (1500) + Rejections (600)                       │
│  P2: Weekly Goals (1200) + Task History (800) + Patterns (600)  │
└─────────────────────────────────────────────────────────────────┘
```

### Marketing Messaging

**For Small Business Owners:**
> "Stop guessing what to work on. iBrain analyzes your company's Speed, Strength, and Intelligence scores to tell you exactly which goals matter most this week."

**For Consultants:**
> "Every client gets an AI co-pilot that remembers their journey. iBrain connects assessment insights to daily execution, making your consulting stickier and more valuable."

**Product Taglines:**
- "iBrain: Your Company's Intelligence Layer"
- "The navy button that knows your business"
- "From assessment to action in one click"
- "Intelligence-as-a-Service for growing businesses"

### Related Documentation
- Technical Implementation: `server/services/AIContextService.js`
- Sprint 13 Epic X: Unified LLM Context Service (42 pts) ✅
- Sprint 14 Epic I: iBrain Visual Identity & Onboarding (planned)
- See: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-14/SPRINT-14-MASTER-PLAN.md`

---

## 🏢 Who Buys and Why (10–200 Employees)
- **Buyer:** Business owners and department leaders of small-to-medium consultancies (10–200 employees) who need recurring, measurable value.
- **Catalyst:** Consultants orchestrate the first multi-level assessment to reveal Speed⚡/Strength🛡/Intelligence🧠 gaps and co-create up to *10* objectives with upto 6 key results** alongside managers, executives, and frontline employees.
- **Value:** The platform transforms those workshops into an always-on operating system, keeping strategy alive as the company scales.

### The Consultant as Gateway

> "Consultants are the bridge between business ambition and daily signals that increase the odds of success."

**My Clients** is the consultant's command center—the single pane of glass for:
1. **Onboarding new clients** into the Karvia ecosystem
2. **Monitoring client health** via cultural scores (SSI framework today, extensible to any framework)
3. **Conducting operations** across the client portfolio (assessments, reviews, interventions)

**Core Philosophy**:
- Consultants are **intermediaries** who translate complex strategy into simple daily actions
- Every client company receives a **Cultural Score** (currently SSI: Speed, Strength, Intelligence) that reveals organizational health
- The assessment framework is **pluggable**—SSI is the default, but future frameworks can be added
- Consultants help clients experience the **simplicity of goal setting** and **following day-to-day signals**
- Success is measured by **increasing the odds of client success**, not just completing engagements

---

## 🧭 Guiding Principles
| Emoji | Principle | What It Means |
| --- | --- | --- |
| ♻️ | Continuous Flow | Assess → Plan → Execute → Learn is a perpetual loop, not a project milestone. |
| 🫶 | Empathy-First | Wellbeing, recognition, and psychological safety sit beside metrics. |
| 🧩 | Dynamic by Design | No hard-coded targets—everything is data/configurable (values, rules, weights). |
| 🔍 | Transparent AI | Every suggestion shows rationale so trust stays high. |
| 🪄 | Three-Step Rhythm | Each role can finish the day’s essentials in ≤3 guided steps. |

---

## 🔄 System Block Diagram
```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Assessments │ ───▶ │ Gap Insights │ ───▶ │ Planning &   │ ───▶ │ Execution &  │
│ (S⚡ / S🛡 / I🧠)│      │  (LLM + Rules)│      │ Objectives   │      │ Gamification │
└─────▲────────┘      └─────▲────────┘      └─────▲────────┘      └─────▲────────┘
      │                       │                       │                     │
      │                       │                       │                     │
      └──────────────◀────────┴────── Analytics & Learning ────────◀────────┘
```
- Data flows through microservices (Assessment, Planner, Scoring, Observer, etc.).
- Feedback from Analytics continually adjusts assessments and planning rules.

---

## 🗺️ Page-by-Page Philosophy
| Navigation Label | Primary Role 🥇 | Secondary Role 🥈 | Supporting Actors | Why It Matters |
| --- | --- | --- | --- | --- |
| **Assessment** (`assessment.html`) | Consultant / Business Owner | Department Manager | Employees, Admin | Honest baseline of Speed⚡/Strength🛡/Intelligence🧠 sets the trajectory. Poor inputs = poor strategy. |
| **Planning** (`planning.html`) | Department Manager | Executive, Consultant | AI Planner, Employees | Turns insights into priorities. Action stack + conflict assistant make/break team momentum. |
| **Objectives** (`objectives.html`) | Executive / Business Owner | Managers | Admin, AI | Links ambition to reality. Transparent cascades prevent misalignment. |
| **Dashboard** (`dashboard.html`) | Department Manager | People Ops, Employees | AI Insights | Daily compass: three-step agenda, wellbeing badges, recognition prompts. |
| **Team** (`team.html`) | Department Manager | Employees | HR/People Ops | Harmonises collaboration; surfaces friction early; celebrates wins often. |
| **Analytics** (`analytics.html`) | Executive / Consultant | Managers | Data/BI systems | Tells the strategic story with trends, ROI, sentiment. Drives renewal & expansion. |
| **Profile** (`profile.html`) | Every User | Admin | Security, Compliance | Personalisation + governance. Keeps the OS trustworthy and compliant. |

## 🎭 Role Journeys & Needs
| Role | Functional Outcome | Emotional Need | Behavioral Response |
| --- | --- | --- | --- |
| **Consultant / Business Owner** (payer) | Launch multi-level assessments, co-create 4 objectives & 4 KRs, prove ongoing value | Confidence that engagements deliver measurable ROI | Renew contracts, expand scope, evangelise platform internally |
| **Department Manager** | Translate gaps into weekly focus, rebalance workload, recognise effort | Trust that the system protects their team’s wellbeing | Uses action stack daily, completes approvals, coaches with empathy |
| **Executive / Director** | Monitor strategy health, sustainability, and risk | Assurance that growth aligns with long-term vision | Adjusts priorities quarterly, funds continued usage |
| **Employee / Individual Contributor** | Understand “why” behind tasks, track progress, feel seen | Motivation, recognition, psychological safety | Completes assessments, engages in dashboard, contributes feedback |

Each page owner is accountable for business value; secondary roles benefit directly; supporting actors reinforce the loop.

---

## 🧑‍🤝‍🧑 Narrative: A Week at a 120-Person Consultancy
1. **Consultant Priya** tailors S⚡/S🛡/I🧠 weights in Assessment, then co-facilitates workshops with managers and execs to lock in **4 objectives and 4 KRs** that matter most right now.
2. **Employees** complete assessments on mobile; inheritance math produces team + individual insights to validate those priorities.
3. **Manager Luis** opens Planning: AI spots a Strength🛡 lag in Customer Success. The action stack nudges him to approve the coaching objective, reassign risky workload, and schedule a wellbeing check.
4. **Executive Maya** reviews Objectives, sees downstream impact, and greenlights the plan with confidence that strategy and culture stay aligned.
5. **Employees** use Dashboard to follow the three-step assistant: today’s tasks, recognition prompts, and a pulse check.
6. **Team** view shows friendly competition; recognition prompts encourage gratitude and trust.
7. **Analytics** generates a narrative for the CEO, proving consulting value and mapping next quarter’s playbook.

Humans feel guided and celebrated; the platform stays adaptive and measurable.

---

## 🔗 Quick Reference Map
| Need | Go Here |
| --- | --- |
| Detailed scope & sprints | `Karvia_OKR_Product_Planning/product_plan_beta1.0.md` |
| Feature breakdown & requirements | `Karvia_OKR_Product_Planning/product_roadmap_detailed.md` |
| User stories by persona | `docs/Karvia_OKR_User_Stories.md` |
| UI critiques & cognitive load notes | `docs/code-review/uidesign reveiew/` |
| Technical architecture & gaps | `docs/code-review/release-2024-09-27.md`, `server/` services |
| Agent heritage & workflows | `/Users/sagarrs/Desktop/Manifestor/goaltracker_test/agents/README.md` |
| iBrain technical foundation | `server/services/AIContextService.js` |
| iBrain visual identity (S14) | `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-14 (Planned)/SPRINT-14-MASTER-PLAN.md` |
| Current sprint (S13) | `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-13 (Planned)/SPRINT13_HANDOFF_DOCUMENT.md` |

---

## 🧠 Bootloading Instructions (For LLMs & Developers)
1. Read this page to grasp philosophy, roles, and flow. ⏱️ <200 tokens.
2. Jump to the table above when you need trailheads to deeper specs.
3. Keep the Three-Step Rhythm & Transparent AI principles in mind when designing or coding.
4. Validate every change against empathy (wellbeing, recognition), alignment (S⚡/S🛡/I🧠), and dynamism (no hardcoding).
5. Log insights back into product docs so the OS keeps evolving.

> “Karvia is the OKR OS that lets humans stay human while machines keep score.”
