# /sprint-review - Retrospective Room

<!-- @GENOME T2-CMD-012 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/sprint-review | linked:- -->

**Aliases**: /retro
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: STRATEGY
**Token Budget**: ~1,200 AUTO
**Purpose**: Sprint retrospective, learnings capture, page-based categorization

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Scrum Master | Process facilitation | Ceremony structure |
| Product Owner | Value assessment | Delivery validation |
| Team Representative | Execution feedback | What worked/didn't |

---

## Document Context

### AUTO (Read at session start) - ~1,200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Sprint handoff (final) | T3-SPR-xxx | ~500 | Full doc |
| Test report summary | T3-TST-xxx | ~300 | Quality metrics |
| Session log (sprint) | T0-SES-001 | ~400 | Sprint entries |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Sprint master plan | T3-SPR-xxx | Current sprint folder |
| Adjacent sprint plans | - | KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/ |
| Velocity history | - | Previous sprint reviews |
| Client pages | - | client/pages/*.html |

### AVAILABLE (Exists, request on demand)

- Detailed test reports
- Individual session notes
- Stakeholder feedback

---

## When to Use This Command

Use `/sprint-review` when:
- Preparing to start a new sprint
- Finalizing epic order and dependencies
- Identifying page/module overlaps across sprints
- Creating internal review documentation
- Validating sprint readiness
- Running retrospectives

---

## Sprint Review Workflow

### Step 1: Load Sprint Context

```
READ -> SPRINT-X-MASTER-PLAN.md
READ -> All epic specs in sprint folder
SCAN -> Adjacent sprint plans for overlaps
```

### Step 2: Create Page Matrix

Generate a page-based categorization:

```markdown
## Page Matrix Template

| Module | Page | Epic | Points | Change Type |
|--------|------|------|--------|-------------|
| Auth | login.html | - | - | No change |
| Auth | forgot-password.html | QF | 3 | New flow |
| Dashboard | dashboard.html | D | 5 | Redesign |
| Assessment | assess-hub.html | J | - | Entry link |
| ... | ... | ... | ... | ... |
```

### Step 3: Identify Conflicts

Check for:
- [ ] **Page overlaps**: Same page modified in multiple sprints
- [ ] **Epic naming collisions**: Same epic letter used in different sprints
- [ ] **Dependency mismatches**: Referenced stories that don't exist
- [ ] **Scope creep**: Unplanned pages being modified

### Step 4: Generate Visual Review

Create ASCII diagram of page impacts:

```
┌─────────────────────────────────────────────────────────┐
│  MODULE: [Name]                          Sprint X 🎯    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ PAGE 1  │  │ PAGE 2  │  │ PAGE 3  │                 │
│  │ file.html│  │file2.html│  │file3.html│               │
│  │         │  │         │  │         │                 │
│  │ Epic X  │  │ No chg  │  │ Epic Y  │                 │
│  │ (N pts) │  │         │  │ (M pts) │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
└─────────────────────────────────────────────────────────┘
```

### Step 5: Validate & Finalize

- [ ] All epics mapped to specific pages
- [ ] No page modified by multiple sprints without intent
- [ ] Dependencies verified (stories exist)
- [ ] Capacity validated (pts/week reasonable)
- [ ] Implementation order defined

---

## Output Artifacts

After running `/sprint-review`, create:

1. **SPRINT-X-PAGE-MATRIX.md** - Page categorization document
2. **Updated SPRINT-X-MASTER-PLAN.md** - If changes needed
3. **SESSION_LOG.md entry** - Document review session

---

## Page Module Reference

Standard KARVIA module groupings:

| Module | Pages | Description |
|--------|-------|-------------|
| **AUTH** | login, signup, forgot-password, reset-password, invitation-accept | Authentication flows |
| **DASHBOARD** | dashboard, manager-dashboard, executive-dashboard, analytics-dashboard | Daily views |
| **ASSESSMENT** | assessment-hub, assessment-creation-flow, assessment-take, assessment-results, question-library, survey* | SSI assessment |
| **SSI_REPORTS** | team-ssi-view, ssi-report, ssi-report-full, ssi-report-public | SSI visualization |
| **OKR** | objectives, okr-creation-wizard, okr-dashboard, ai-okr-review, ai-business-insights | OKR management |
| **PLANNING** | planning, quarterly-goals, goal-details | Weekly/quarterly planning |
| **COMPANY** | company-profile, configuration, teams, team-performance-dashboard | Company settings |
| **FEEDBACK** | feedback, feedback-admin | User feedback |
| **GLOBAL** | navigation.js (affects all pages) | Cross-cutting |

---

## Conflict Resolution Patterns

### Pattern 1: Page Overlap

```
PROBLEM: planning.html modified in both Sprint 11 (Epic L) and Sprint 13 (Epic P)

RESOLUTION OPTIONS:
A) Merge into one comprehensive epic (larger scope, single sprint)
B) Sequence: Complete first, then second builds on it
C) Remove duplicate (if one covers the other)

DECISION CRITERIA:
- If >70% overlap → Merge or Remove duplicate
- If <30% overlap → Sequence (note dependency)
- If complementary → Merge into comprehensive epic
```

### Pattern 2: Missing Dependency

```
PROBLEM: Sprint 11 lists "Sprint 10 D1, D2, D4" but Sprint 10 has no Epic D

RESOLUTION:
1. Identify what the dependency actually requires
2. Check if requirement is already met (different naming)
3. If not met → Add to current sprint or previous
4. Update documentation to reference correct stories
```

### Pattern 3: Epic Naming Collision

```
PROBLEM: Sprint 12 Epic P (Industry) vs Sprint 13 Epic P (Planning)

RESOLUTION:
- Rename one using next available letter
- Update all references in master plans
- Log in CHANGE_LOG.md
```

---

## Quality Checklist

Before finalizing sprint review:

- [ ] All epics have page assignments
- [ ] No unintentional page overlaps
- [ ] Dependencies verified (exist and complete)
- [ ] Capacity realistic (historical velocity)
- [ ] Implementation order defined
- [ ] Conflicts documented and resolved
- [ ] PAGE-MATRIX.md created
- [ ] Master plan updated if needed

---

## Example Usage

```
User: /sprint-review

Claude:
1. Loads Sprint 11 Master Plan
2. Identifies 4 epics (J, L, M, Quickfix)
3. Maps to pages:
   - Epic J → 3 new assessment pages + 2 existing
   - Epic L → planning.html
   - Epic M → okr-creation-wizard.html
   - Quickfix → forgot-password.html
4. Detects overlap with Sprint 13 Epic P
5. Recommends resolution
6. Creates SPRINT-11-PAGE-MATRIX.md
7. Updates master plan if approved
```

---

## Exit Criteria

- [ ] Sprint review document created
- [ ] What worked / What didn't captured
- [ ] Action items for next sprint
- [ ] Velocity recorded
- [ ] PAGE-MATRIX.md created (if applicable)
- [ ] No unresolved conflicts
- [ ] Sprint folder marked "(Complete)" (if closing sprint)
- [ ] SESSION_LOG.md updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*sprint-review" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

Sprint review is complete when:
- [ ] PAGE-MATRIX.md created with all epics
- [ ] No unresolved conflicts
- [ ] Implementation order documented
- [ ] Dependencies verified
- [ ] Ready for `/coding` session

---

**NOW BEGIN SPRINT REVIEW**

Ask user which sprint to review, then:
1. Load sprint master plan
2. Create page matrix
3. Identify conflicts
4. Propose resolutions
5. Generate documentation
