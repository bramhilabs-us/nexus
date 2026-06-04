# /strategy - Strategy Session Initialization

<!-- @GENOME T2-CMD-003 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/strategy | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: STRATEGY
**Token Budget**: ~2,500 AUTO
**Purpose**: Sprint planning, architecture decisions, epic breakdown, specifications

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Product Strategist | Business alignment | OKR context |
| Technical Architect | System design | Implementation paths |
| Sprint Planner | Delivery planning | Story pointing |

---

## Document Context

### AUTO (Read at session start) - ~2,500 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~800 | Full architecture overview |
| CONTEXT_REGISTRY.md | T2-ARC-001 | ~600 | Quick lookup, domain references |
| Current sprint handoff | T3-SPR-xxx | ~600 | Current progress, blockers |
| SESSION_LOG.md | T0-SES-001 | ~500 | Last 5 strategy entries |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Previous sprint master plan | T3-SPR-xxx | KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/ |
| Product roadmap | T1-PRD-002 | KARVIA_STRATEGY/1-PRODUCT/roadmap/ |
| Technical specs | T3-SPR-xxx | Current sprint folder |

### AVAILABLE (Exists, request on demand)

- Previous sprint audit reports
- Product vision documents
- Architecture decision records

---

## Strategy Session Objectives

What are you planning today? (Respond with specifics):
- [ ] New sprint planning (Sprint X)
- [ ] Epic breakdown for existing sprint
- [ ] Architecture decision for [feature]
- [ ] Risk assessment and dependency mapping
- [ ] Technical specification creation
- [ ] Other: [specify]

---

## Session Setup

**Session Metrics (Track these)**:
- [ ] Documentation Quality: Target ≥90%
- [ ] Strategic Alignment: Target 100%
- [ ] Dependency Identification: Target ≥85%
- [ ] Risk Assessment Coverage: Target ≥80%
- [ ] Actionable Artifacts: Target 100%
- [ ] Token Efficiency: Target ≤30% (40-60K)

**Expected Deliverables**:
```
For Sprint Planning:
□ SPRINT-X-MASTER-PLAN.md (Epic structure, story points)
□ SPRINT-X-DAILY-EXECUTION-PLAN.md (Day-by-day tasks)
□ SPRINT-X-TECHNICAL-IMPLEMENTATION.md (Code specifications)
□ SPRINT-X-USER-STORIES.md (Acceptance criteria)
□ SPRINT-X-DEPENDENCIES-RISKS.md (Risk management)
□ SPRINTX_KICKOFF.md (Session starter)

For Epic Breakdown:
□ Epic specifications with story points
□ User stories with acceptance criteria
□ Technical implementation details
□ File-level breakdown
```

---

## Strategy Session Quality Gates

Before completing this session, verify:

**Strategic Quality**:
- [ ] All epics have clear business value
- [ ] Story points estimated using complexity + effort
- [ ] Acceptance criteria are measurable
- [ ] Dependencies identified and documented
- [ ] Risks rated (Critical/High/Medium/Low)
- [ ] Technical approach validated

**Documentation Quality**:
- [ ] All documents follow consistent format
- [ ] File references include line numbers
- [ ] Next steps clearly defined
- [ ] Handoff document updated
- [ ] Session break notes created (if >50% tokens)

**Actionability**:
- [ ] Coding session can start immediately from specs
- [ ] No ambiguous requirements
- [ ] All questions answered
- [ ] Clear "definition of done" for each epic

---

## Post-Session Requirements

After completing strategy work:

1. **Update Session Log**:
   ```markdown
   | [Date] | Strategy | [Xh] | [YK] | 0 (planning) | [Z/10] | [Outputs] | [Notes] |
   ```

2. **Create Handoff Entry**:
   - Document what was planned
   - Identify next session (likely Coding)
   - List prerequisites for implementation

3. **Rate Session Quality** (1-10):
   - 10 = Perfect planning, zero ambiguity, ready to code
   - 8-9 = Good planning, minor clarifications needed
   - 6-7 = Acceptable but needs refinement
   - <6 = Requires rework

4. **Commit** (if files created):
   ```bash
   git add .
   git commit -m "docs(sprintX): Complete strategy session - [Focus]

   - Created [document 1]
   - Defined [epic/feature]
   - Story points: [X]

   Strategy Session - Sprint X
   Quality Rating: [X/10]

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

---

## Success Criteria

This strategy session is successful when:
- ✅ All objectives (checked above) are complete
- ✅ Expected deliverables created
- ✅ Quality gates passed
- ✅ Session rating ≥8/10
- ✅ Next session can start without blockers
- ✅ Token usage 40-60K (20-30% of budget)

---

---

## Exit Criteria

- [ ] All selected objectives completed
- [ ] Expected deliverables created
- [ ] Quality gates passed
- [ ] Session rating ≥8/10
- [ ] Next session can start without blockers
- [ ] Handoff document updated
- [ ] SESSION_LOG.md updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*strategy" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

**NOW BEGIN THE STRATEGY SESSION**

Based on the objectives you selected above, proceed with:
1. Epic breakdown and story pointing
2. Technical specification creation
3. Dependency and risk identification
4. Documentation creation
5. Handoff preparation

Track token usage and create session break notes if approaching 50K tokens.
