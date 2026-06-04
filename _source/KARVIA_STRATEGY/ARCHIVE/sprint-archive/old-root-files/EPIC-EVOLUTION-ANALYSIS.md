# Epic Evolution Analysis

**Created**: January 19, 2026
**Purpose**: Track how epics evolved across Sprint 11-12-13 planning
**Status**: Strategy Discussion Document

---

## Epic Evolution Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           EPIC EVOLUTION: SPRINT 11 → 12 → 13                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  EPIC           SPRINT 11         SPRINT 12          SPRINT 13         STATUS                       │
│  ══════════════════════════════════════════════════════════════════════════════════════════════════  │
│                                                                                                      │
│  ASSESSMENT     Epic J (28pts)    ───────→           ───────→          SPRINT 11 ✅                  │
│  CREDIBILITY    Full scope        (no changes)       (no changes)      Modular Q system             │
│                                                                                                      │
│  PLANNING       Epic L (25pts)    ───────→           Epic P (5pts)     CONFLICT ⚠️                   │
│  REDESIGN       Week tiles + AI   (no changes)       Two-panel         Recommend: Keep L            │
│                                                                        Remove S13 P                  │
│                                                                                                      │
│  OKR WIZARD     Epic M (13pts)    ───────→           ───────→          SPRINT 11 ✅                  │
│                 Phase 1 only      Full 45pts         (no changes)      Phase 1 scoped               │
│                                   in S12 backup                                                     │
│                                                                                                      │
│  SSI BLOCKS     ───────           Epic N (21pts)     ───────→          SPRINT 12 ✅                  │
│                 (not planned)     12-block persist   (no changes)      New in S12                   │
│                                                                                                      │
│  TARGET CALC    ───────           Epic O (18pts)     ───────→          SPRINT 12 ✅                  │
│                 (not planned)     Smart KR targets   (no changes)      New in S12                   │
│                                                                                                      │
│  INDUSTRY       ───────           Epic P (9pts)      ───────→          SPRINT 12 ✅                  │
│  ALIGNMENT      (not planned)     Industry filters   (no changes)      New in S12                   │
│                                                                                                      │
│  LLM QUALITY    ───────           Epic Q (26pts)     ───────→          SPRINT 12 ✅                  │
│                 (not planned)     Auth + prompts     (no changes)      From audit                   │
│                                                                                                      │
│  CHIEF AI       ───────           ───────            Epic R (3pts)     SPRINT 13 ✅                  │
│  REBRANDING     (not planned)     (not planned)      Logo + colors     Visual only                  │
│                                                                                                      │
│  NAVIGATION     ───────           ───────            Epic T (5pts)     SPRINT 13 ✅                  │
│  VISUAL         (not planned)     (not planned)      Philosophy        Reduced from 38pts           │
│                                                      colors            to 5pts                      │
│                                                                                                      │
│  DASHBOARD      ───────           ───────            Epic D (5pts)     SPRINT 13 ✅                  │
│  REDESIGN       (not planned)     (not planned)      3-column UI       Visual only                  │
│                                                                                                      │
│  OBJECTIVES     ───────           ───────            Epic O (3pts)     SPRINT 13 ✅                  │
│  STYLING        (not planned)     (not planned)      Card styling      Visual only                  │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Epic Evolution

### 1. Assessment Credibility (Epic J)

| Aspect | Sprint 10 Plan | Sprint 11 Plan | Evolution Notes |
|--------|---------------|----------------|-----------------|
| **Location** | Sprint 10 | Moved to Sprint 11 | Deferred for scope |
| **Points** | 28 | 28 | No change |
| **Scope** | Modular Q system | Same | No scope creep |
| **Stories** | J1-J8 | J1-J8 | Same breakdown |

**Why It Evolved**: Epic J was originally Sprint 10 but moved to Sprint 11 to allow Epic K (Company Profile) completion first, which provides the business metrics context needed for assessment questions.

**Key Features (Unchanged)**:
- ModularAssessmentQuestion schema with module_type, question_subtype
- 3-step template wizard (Select → Configure → Review)
- Industry-specific question pools (Financial Services, etc.)
- Role-based question filtering

---

### 2. Planning Page Redesign (Epic L vs Epic P)

| Aspect | Sprint 11 Epic L | Sprint 13 Epic P | Conflict Analysis |
|--------|-----------------|------------------|-------------------|
| **Points** | 25 | 5 | L is 5x larger |
| **Layout** | Week tiles grid (6 cols) | Two-panel | Different approaches |
| **AI Context** | L5: AI context assembly (5pts) | None | L has AI integration |
| **KR Sidebar** | L2: KR sidebar (3pts) | P1: KR sidebar (1pt) | Similar feature |
| **Week Cards** | L3: Expansion panel (5pts) | P2: Collapsible cards (2pts) | Similar feature |
| **Owner** | Not specified | P3: Clickable owner (2pts) | P adds this |

**Conflict Resolution**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  RECOMMENDATION: Keep Epic L (Sprint 11), Remove Epic P (Sprint 13)        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Reasoning:                                                                │
│  1. Epic L is comprehensive (25pts) vs Epic P is incremental (5pts)       │
│  2. Epic L includes AI context assembly - strategic value                  │
│  3. 70%+ feature overlap - doing both is redundant                        │
│  4. Epic L designed for week tiles grid aligns with AI planning vision    │
│                                                                            │
│  Action: Remove Epic P from Sprint 13, add P3 (owner assignment) to L     │
│                                                                            │
│  Updated Sprint 13: 21 - 5 = 16 pts                                       │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. OKR Wizard (Epic M)

| Aspect | Full Spec | Sprint 11 Phase 1 | Evolution Notes |
|--------|-----------|-------------------|-----------------|
| **Total Points** | 45 | 13 | Phased approach |
| **Scope** | All 3 modes | Foundation only | Reduced for focus |
| **Phase 1** | M1, M2, M6, M10 | Same | Wizard structure + mode selection |
| **Phase 2-3** | M3-M5, M7-M16 | Sprint 12+ | Deferred |

**Epic M Evolution**:

```
Full Spec (45 pts):                    Sprint 11 Phase 1 (13 pts):
┌────────────────────────┐             ┌────────────────────────┐
│ Phase 1: Foundation    │             │ M1: Wizard page (5pts) │
│ - Wizard page          │             │ M6: Mode selection (3) │
│ - Mode selection       │ ───────────→ │ M10: Model extend (3)  │
│ - Model extensions     │             │ M2: Context review (2) │
│ - Context review       │             └────────────────────────┘
│                        │
│ Phase 2: Core Gen      │             Sprint 12+ (32 pts):
│ - Category selection   │             ┌────────────────────────┐
│ - Enhanced prompts     │             │ M3-M5: Steps 2-4       │
│ - Generation flow      │ ───────────→ │ M7-M9: Gap filling     │
│ - Review/edit          │             │ M11-M14: Team cascade  │
│                        │             │ M15-M16: AI enhance    │
│ Phase 3: Cascade       │             └────────────────────────┘
│ - Team OKRs            │
│ - Parent alignment     │
└────────────────────────┘
```

**Why Phased**: Breaking Epic M into phases allows Sprint 11 to ship a working wizard foundation while deferring complex AI features (gap-filling, cascade) to Sprint 12.

---

### 4. Sprint 13 Visual Redesign (Epics R, T, D, O)

| Epic | Original Spec | Final Spec | Evolution |
|------|---------------|------------|-----------|
| **R** (Chief AI) | Not planned | 3 pts | New - branding need |
| **T** (Navigation) | 38 pts | 5 pts | **Reduced 87%** |
| **D** (Dashboard) | Not planned | 5 pts | New - UI modernization |
| **O** (Objectives) | Not planned | 3 pts | New - visual consistency |
| **P** (Planning) | 5 pts | **REMOVE** | Conflicts with S11 L |

**Epic T Evolution** (Navigation):

```
Original Epic T (38 pts):               Final Epic T (5 pts):
┌────────────────────────────┐          ┌────────────────────────────┐
│ Card-based hub redesign    │          │ T1: Reorder items (1pt)    │
│ Role-adaptive dashboard    │          │ T2: Visual dividers (1pt)  │
│ Breadcrumb navigation      │ ────────→ │ T3: Color accents (1pt)    │
│ 21+ page integrations      │          │ T4: Custom tooltips (2pts) │
│ New API endpoints          │          │                            │
│ Dashboard data service     │          │ Philosophy visual only     │
└────────────────────────────┘          └────────────────────────────┘

Decision: Full redesign was over-engineered. Visual enhancement achieves
the same product philosophy communication with 87% less effort.
```

---

## Sprint Scope Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SPRINT SCOPE EVOLUTION                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SPRINT 11                                                                  │
│  ═════════                                                                  │
│  Original: 41 pts (Epic L + Epic M Phase 1)                                │
│  Current:  69 pts (+Epic J from S10, +Quickfix)                            │
│                                                                             │
│  Change: +28 pts (Epic J moved from Sprint 10)                             │
│                                                                             │
│  SPRINT 12                                                                  │
│  ═════════                                                                  │
│  Original: Epic M Phase 2-3 focused                                        │
│  Current:  74 pts (Epics N, O, P, Q)                                       │
│                                                                             │
│  Change: Pivoted to SSI persistence + LLM fixes (from audit)               │
│                                                                             │
│  SPRINT 13                                                                  │
│  ═════════                                                                  │
│  Original: 21 pts (R + T + D + O + P)                                      │
│  Recommended: 16 pts (Remove Epic P - overlap with S11 L)                  │
│                                                                             │
│  Change: -5 pts (Epic P removed)                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Strategic Decisions

### Decision 1: Epic J Movement (S10 → S11)

```
Rationale:
├── Epic K (Business Metrics) provides context for assessment questions
├── Company profile completion enables industry-specific question pools
└── Better user experience: profile → assessment → OKR flow
```

### Decision 2: Epic M Phasing (45 → 13 pts)

```
Rationale:
├── Ship working wizard foundation faster
├── User feedback before building cascade features
├── De-risk AI complexity by isolating features
└── Phase 2-3 can adjust based on Phase 1 learnings
```

### Decision 3: Epic T Reduction (38 → 5 pts)

```
Rationale:
├── Original spec was over-engineered
├── Philosophy colors achieve same goal
├── Card-based hub can be future work if needed
└── 87% effort reduction for similar UX impact
```

### Decision 4: Remove Sprint 13 Epic P

```
Rationale:
├── 70%+ overlap with Sprint 11 Epic L
├── Epic L is comprehensive (25 pts) with AI context
├── Doing both creates technical debt
└── Sprint 13 focus should be branding, not architecture
```

---

## Page Impact Summary

| Page | S11 | S12 | S13 | Total Changes |
|------|-----|-----|-----|---------------|
| planning.html | **Epic L (25pts)** | - | ~~Epic P~~ | 1 major redesign |
| okr-creation-wizard.html | **Epic M (8pts)** | - | - | 1 structure change |
| assessment-template-*.html | **Epic J (10pts)** | - | - | 3 new pages |
| dashboard.html | - | - | Epic D (5pts) | 1 visual update |
| objectives.html | - | - | Epic O (3pts) | 1 styling update |
| navigation.js | - | - | Epic R+T (8pts) | 1 branding update |
| team-ssi-view.html | - | Epic N (21pts) | - | 1 major update |
| ssi-report.html | - | Epic N (included) | - | 1 narrative update |
| company-profile.html | - | Epic P (9pts) | - | 1 industry update |

---

## Mockups Centralized

All sprint mockups are now in: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/`

| File | Sprint | Purpose |
|------|--------|---------|
| sprint11-internal-review.html | 11 | Page matrix visualization |
| sprint13-dashboard-redesign.html | 13 | Dashboard mockup (v16) |
| sprint13-planning-redesign.html | 13 | Planning mockup (v4) |
| sprint13-objectives-redesign.html | 13 | Objectives mockup |
| sprint2-planning.html | 2 | Legacy planning mockup |
| sprint2-planning-integrated.html | 2 | Legacy integrated mockup |

---

## Recommended Final Sprint Plan

### Sprint 11 (69 pts - 2.5 weeks) ✅ APPROVED

| Epic | Points | Focus |
|------|--------|-------|
| Epic J | 28 | Assessment Credibility |
| Epic L | 25 | Planning Redesign |
| Epic M Phase 1 | 13 | OKR Wizard Foundation |
| Quickfix | 3 | Forgot Password |

### Sprint 12 (74 pts - 2.5 weeks)

| Epic | Points | Focus |
|------|--------|-------|
| Epic N | 21 | SSI 12-Block Persistence |
| Epic O | 18 | Smart KR Target Calculator |
| Epic P | 9 | Industry Alignment |
| Epic Q | 26 | LLM Quality & Security |

### Sprint 13 (16 pts - 1 week) UPDATED

| Epic | Points | Focus |
|------|--------|-------|
| Epic R | 3 | Chief AI Rebranding |
| Epic T | 5 | Navigation Visual |
| Epic D | 5 | Dashboard Redesign |
| Epic O | 3 | Objectives Styling |
| ~~Epic P~~ | ~~5~~ | ~~REMOVED~~ |

---

## Next Steps

1. **Approve Sprint 11 plan** (69 pts with Epic J, L, M, QF)
2. **Update Sprint 13 Master Plan** (remove Epic P)
3. **Update references** in mockup files to new location
4. **Start coding session** with `/coding`

---

**Document Status**: Ready for approval
**Next Action**: Finalize sprint plan, then start implementation
