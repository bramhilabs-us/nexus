# /design - Design Session Initialization

<!-- @GENOME T2-CMD-005 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/design | linked:- -->

**Aliases**: None
**Version**: 2.1.0
**Last Updated**: March 30, 2026
**Session Type**: DESIGN
**Token Budget**: ~1,700 AUTO
**Purpose**: UI mockups, design system updates, visual specifications

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| UI Designer | Visual patterns | CSS variables, layout |
| UX Designer | User flows | Interaction states |
| Product Owner | Beta philosophy | Focus priorities |

---

## Document Context

### AUTO (Read at session start) - ~1,700 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| DESIGN_SYSTEM.md | T2-DES-001 | ~800 | Colors, typography, components |
| Current sprint handoff | T3-SPR-xxx | ~400 | Design tasks |
| CONTEXT_REGISTRY.md | T2-ARC-001 | ~300 | File placement |
| SESSION_LOG.md | T0-SES-001 | ~200 | Recent design entries |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Beta roadmap | T1-PRD-002 | KARVIA_STRATEGY/1-PRODUCT/roadmap/ |
| Mockup folders | T3-PRD-xxx | KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/ |
| S13 patterns CSS | - | client/css/s13-patterns.css |

### AVAILABLE (Exists, request on demand)

- Existing page HTML files
- Component examples
- Email design system

---

## PRE-DESIGN CHECKLIST (CRITICAL)

Before creating ANY mockup or design document, Claude MUST:

```
[ ] 1. Read CLAUDE.md (root) - Security, XSS prevention
[ ] 2. Read .claude/DESIGN_SYSTEM.md (MANDATORY)
[ ] 3. For BETA work: Read Beta context (see section below)
[ ] 4. Identify color system: Primary (Purple) vs SSI (Navy/Gold)
[ ] 5. Check existing mockup folder README for requirements
```

---

## BETA MOCKUPS MODE (Current Focus)

### Required Context Loading

```
READ:DEEP  → KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/00_BETA_RELEASE_PROJECT_ROADMAP.md
READ:DEEP  → KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/README.md
READ:DEEP  → [Specific folder]/README.md (based on mockup type)
READ:SKIM  → .claude/DESIGN_SYSTEM.md
READ:SKIM  → client/pages/dashboard-v2.html (for layout reference)
```

### Beta Philosophy Reminder

> "People use Garmin because they WANT to see their steps, not because their boss told them to."

**All Beta mockups must reinforce**:
- **Single focus** over task lists
- **Progress visibility** that creates pull
- **Celebration** of micro-wins
- **Reflection** not reporting

### Beta Design Language

| Use This | Not This |
|----------|----------|
| "Today's Priority" | "Tasks" |
| "Momentum" | "Streak" |
| "Reflection" | "Report" |
| "Progress" | "Performance" |
| "Focus" | "Workload" |

---

## BETA MOCKUP FOLDERS

| Folder | Sprint | Status | Description |
|--------|--------|--------|-------------|
| [01_TEAM_FORMATION](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/01_TEAM_FORMATION/) | Pre-S21 | **PRIORITY** | SSI-based team grouping |
| [02_SINGLE_PRIORITY_VIEW](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/02_SINGLE_PRIORITY_VIEW/) | S22 | PENDING | Dashboard V3 with focus |
| [03_WEEKLY_REFLECTION](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/03_WEEKLY_REFLECTION/) | S23 | PENDING | Friday reflection modal |
| [04_STREAK_MOMENTUM](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/04_STREAK_MOMENTUM/) | S23 | PENDING | Engagement display |
| [05_CONSULTANT_DASHBOARD](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/05_CONSULTANT_DASHBOARD/) | S24 | PENDING | Consultant tools |
| [06_EVIDENCE_CAPTURE](../../KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/06_EVIDENCE_CAPTURE/) | S24 | PENDING | Session logging UI |

### To Create a Beta Mockup

1. Read the folder's README.md for requirements
2. Follow the element checklists
3. Create mockup (HTML, Figma export, or ASCII)
4. Update folder README with mockup details
5. Mark checklist items complete

---

## CONTEXT LOADING BY DESIGN TYPE

### Type A: Beta Mockup (Current Priority)

```
READ:DEEP  → BETA_RELEASE_PROJECT_ROADMAP.md (philosophy, goals)
READ:DEEP  → BETA_MOCKUPS/[folder]/README.md (requirements)
READ:DEEP  → .claude/DESIGN_SYSTEM.md
READ:SKIM  → client/pages/dashboard-v2.html (layout patterns)
READ:SKIM  → client/css/s13-patterns.css (component classes)
```

### Type B: SSI/Assessment Design

```
READ:DEEP  → .claude/DESIGN_SYSTEM.md → SSI System section
READ:DEEP  → client/pages/team-ssi-view.html
READ:DEEP  → client/pages/scripts/team-ssi-view.js
READ:SKIM  → client/css/s13-patterns.css (SSI patterns)
```

### Type C: General Page Mockup

```
READ:DEEP  → .claude/DESIGN_SYSTEM.md
READ:DEEP  → client/pages/dashboard-v2.html (S13 layout)
READ:SKIM  → client/css/s13-patterns.css
READ:SKIM  → Related existing page
```

### Type D: Component Design

```
READ:DEEP  → .claude/DESIGN_SYSTEM.md → Component Patterns
READ:DEEP  → client/css/s13-patterns.css
READ:SKIM  → Existing components in HTML files
```

---

## DESIGN AUTHORITY HIERARCHY

```
s13-patterns.css (MASTER)
    │
    ├── DESIGN_SYSTEM.md (QUICK REFERENCE)
    │   └── Copy for Claude sessions
    │
    ├── Primary System (Purple)
    │   └── Main app, dashboards, goals
    │
    └── SSI System (Navy/Gold)
        └── Assessments, reports, team SSI
```

**Conflict Resolution**: s13-patterns.css > DESIGN_SYSTEM.md > Inline styles

---

## COLOR SYSTEM DECISION

### Use Primary System (Purple) for:
- Dashboard pages
- Goals and tasks views
- Planning pages
- Team management
- Settings pages
- General app UI
- **Beta: Single Priority View, Momentum**

### Use SSI System (Navy/Gold) for:
- SSI assessment reports
- Team SSI view
- Assessment results
- SSI score displays
- Executive SSI summaries
- **Beta: Team Formation (SSI context)**

---

## MOCKUP OUTPUT FORMATS

### Option 1: ASCII Mockup (Quick)

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER - Company Logo | User Menu                              │
├──────────┬──────────────────────────────────────────────────────┤
│  SIDEBAR │  TODAY'S PRIORITY                                    │
│          │  ┌─────────────────────────────────────────────────┐ │
│  • Home  │  │  ★ Complete Q1 Revenue Analysis                 │ │
│  • Teams │  │     Due: Today 5pm | KR: Revenue Growth         │ │
│  • Goals │  │     [Mark Complete]                             │ │
│          │  └─────────────────────────────────────────────────┘ │
│          │                                                      │
│          │  UP NEXT (collapsed)                                 │
│          │  ▶ 2 more items for this week                       │
└──────────┴──────────────────────────────────────────────────────┘
```

### Option 2: HTML Mockup (Interactive)

Create in `KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/[folder]/`

### Option 3: Component Spec (Implementation-Ready)

```markdown
## Component: Priority Card

### HTML Structure
- Container: `k-card k-card--priority`
- Header: Priority icon + title
- Body: Context (KR link, due date)
- Footer: Action button

### States
- Default: Ready to work
- In Progress: Currently active
- Completed: Celebration state
- Blocked: Needs attention

### CSS Variables
- --priority-bg: var(--karvia-surface)
- --priority-accent: var(--karvia-primary)
```

---

## BETA MOCKUP TEMPLATE

```markdown
# [Screen Name] Mockup

**Version**: 1.0
**Created**: YYYY-MM-DD
**Status**: Draft | Review | Approved
**Sprint**: S21/S22/S23/S24/S25
**Story**: BETA-00X

---

## Philosophy Check

- [ ] Reinforces single focus (not task list)
- [ ] Creates pull (user wants to see this)
- [ ] Celebrates progress
- [ ] Uses Beta language (momentum, not streak)

---

## Visual Mockup

[ASCII or image reference]

---

## Elements

| Element | CSS Class | Notes |
|---------|-----------|-------|
| [Element] | [Class] | [Purpose] |

---

## States

| State | Trigger | Visual Change |
|-------|---------|---------------|
| [State] | [When] | [What changes] |

---

## Interactions

| Element | Action | Result |
|---------|--------|--------|
| [Element] | [Click/Hover] | [What happens] |

---

## Approval

- [ ] Product owner reviewed
- [ ] Philosophy aligned
- [ ] Implementation ticket created
```

---

## FILE PLACEMENT

| Design Type | Save Location |
|-------------|---------------|
| Beta Mockup | `KARVIA_STRATEGY/1-PRODUCT/mockups/BETA_MOCKUPS/[folder]/` |
| Page HTML | `client/pages/` |
| Page script | `client/pages/scripts/` |
| CSS updates | `client/css/s13-patterns.css` |
| General Mockup | `KARVIA_STRATEGY/1-PRODUCT/mockups/` |

---

## DESIGN QUALITY GATES

### Beta Philosophy Alignment

```
[ ] Single focus reinforced (not overwhelming)
[ ] Creates pull (user engagement, not compliance)
[ ] Celebrates micro-wins
[ ] Uses approved Beta language
[ ] Consultant workflow considered
```

### Visual Consistency

```
[ ] Uses CSS variables (no hardcoded colors)
[ ] Follows k-card, k-btn patterns
[ ] Consistent with S13 layout
[ ] Responsive considerations noted
[ ] Inter font applied
```

### Code Quality (if implementing)

```
[ ] Uses escapeHtml() for user content (XSS prevention)
[ ] Includes karvia_token handling
[ ] Proper loading states
[ ] Error state handling
```

---

## SESSION WORKFLOW

### 1. Context Loading (First 10 minutes)

```bash
# For Beta mockups:
Read: BETA_RELEASE_PROJECT_ROADMAP.md
Read: BETA_MOCKUPS/README.md
Read: BETA_MOCKUPS/[folder]/README.md
Read: DESIGN_SYSTEM.md
```

### 2. Requirements Review

```
- What mockups are needed? (from folder README)
- What elements are required?
- What states must be covered?
- What interactions are expected?
```

### 3. Mockup Creation

```
- Start with ASCII for quick iteration
- Add component specs for implementation
- Create HTML if interactive demo needed
```

### 4. Quality Check

```
- Philosophy gates passed?
- Visual consistency?
- All required elements?
- All states covered?
```

### 5. Documentation Update

```
- Update folder README with mockup details
- Mark checklist items complete
- Note approval status
```

---

## TOKEN CHECKPOINTS

- At 20K (10%): Context loading complete
- At 40K (20%): First mockup draft complete
- At 60K (30%): Mockups finalized
- At 80K (40%): Documentation updated, ready to close

---

## SESSION METRICS

```
[ ] Clarity: Designs are implementable
[ ] Consistency: Follows design system
[ ] Philosophy: Beta principles applied
[ ] Completeness: All states covered (loading, error, empty)
[ ] Documentation: Folder READMEs updated
```

---

## WHAT ARE YOU DESIGNING TODAY?

**Design Type**:
- [ ] Beta Mockup (Priority)
- [ ] SSI/Assessment
- [ ] General Page
- [ ] Component

**If Beta Mockup, which folder?**
- [ ] 01_TEAM_FORMATION (Pre-S21)
- [ ] 02_SINGLE_PRIORITY_VIEW (S22)
- [ ] 03_WEEKLY_REFLECTION (S23)
- [ ] 04_STREAK_MOMENTUM (S23)
- [ ] 05_CONSULTANT_DASHBOARD (S24)
- [ ] 06_EVIDENCE_CAPTURE (S24)

**Color System**:
- [ ] Primary (Purple)
- [ ] SSI (Navy/Gold)

---

## SUCCESS CRITERIA

This design session is successful when:

```
[ ] Appropriate context loaded
[ ] Beta philosophy applied (if Beta mockup)
[ ] Correct color system used
[ ] CSS variables used (no hardcoded hex)
[ ] All required elements designed
[ ] All states covered
[ ] Folder README updated
[ ] Approval checklist progressed
[ ] Session rating >= 8/10
```

---

**NOW BEGIN DESIGNING**

1. Identify your design type (Beta Mockup recommended)
2. Load the appropriate context files
3. Review the folder README requirements
4. Create the mockup following templates
5. Verify against quality gates
6. Update documentation

---

---

## Exit Criteria

- [ ] Appropriate context loaded
- [ ] Design system followed (CSS variables)
- [ ] All required elements designed
- [ ] All states covered (loading, error, empty)
- [ ] Folder README updated
- [ ] Session rating ≥8/10
- [ ] Handoff document updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*design" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

**Remember**:
- Use CSS variables, never hardcode colors
- Beta = behavior change, not task tracking
- Single focus > task lists
- Momentum > streaks
- Celebrate before presenting next action
