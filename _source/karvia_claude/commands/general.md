# /general - Open Discussion Room

<!-- @GENOME T2-CMD-011 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/general | linked:- -->

**Aliases**: /debug, /research
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: GENERAL
**Token Budget**: ~300 AUTO
**Purpose**: Quick tasks, research, debugging, ad-hoc questions

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Generalist | Flexible | Broad knowledge |
| Researcher | Investigation | Search skills |
| Debugger | Problem solving | Analytical approach |

---

## Document Context

### AUTO (Read at session start) - ~300 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~300 | §Project Overview only |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| SESSION_LOG.md | T0-SES-001 | .claude/ |
| Current sprint handoff | T3-SPR-xxx | Current sprint folder |
| CONTEXT_REGISTRY.md | T2-ARC-001 | .claude/ |
| Everything else | - | On demand |

### AVAILABLE (Exists, request on demand)

- Full codebase
- All documentation
- Web search
- Previous session history

---

## Session Modes

**Mode A: Quick Question**
- Minimal context needed
- Fast, focused answer
- Example: "How do I add a new API endpoint?"

**Mode B: Research** (alias: /research)
- Technology evaluation
- Options analysis
- Recommendation with rationale

**Mode C: Debug** (alias: /debug)
- Error investigation
- Root cause analysis
- Fix proposal (escalate to /quick-fix if urgent)

---

## Session Category

**What type of general session is this?**

- [ ] **Research & Exploration** - Technology evaluation, library comparison, best practices
- [ ] **Brainstorming** - Feature ideation, problem-solving, design thinking
- [ ] **Q&A** - Technical questions, clarifications, how-to guidance
- [ ] **Quick Fix** - Small bug fixes, configuration updates (for urgent: use /quick-fix)
- [ ] **Documentation** - Update docs, create guides, improve clarity
- [ ] **Debugging Support** - Investigate issues, understand errors
- [ ] **Other**: [Specify]

---

## Session Objectives

**Primary Question/Goal**:
[State your specific question or objective clearly]

**Context/Background**:
[Provide any relevant background information]

**What You've Already Tried** (if applicable):
- [Attempt 1]
- [Attempt 2]

**Desired Outcome**:
[What would a successful answer/solution look like?]

---

## Session Guidelines by Category

### Research & Exploration

**Good research sessions**:
- ✅ Clear evaluation criteria defined
- ✅ Multiple options compared objectively
- ✅ Pros/cons documented
- ✅ Recommendation with justification
- ✅ Implementation considerations noted

**Research Template**:
```markdown
## Research: [Topic]

### Options Evaluated
1. [Option 1]
   - Pros: [List]
   - Cons: [List]
   - Fit for Karvia: [Assessment]

2. [Option 2]
   - Pros: [List]
   - Cons: [List]
   - Fit for Karvia: [Assessment]

### Recommendation
[Option X] because:
- [Reason 1]
- [Reason 2]

### Implementation Notes
- [Consideration 1]
- [Consideration 2]

### Next Steps
- [ ] [Action 1]
- [ ] [Action 2]
```

---

### Brainstorming

**Good brainstorming sessions**:
- ✅ Multiple ideas generated
- ✅ Ideas evaluated against criteria
- ✅ Feasibility assessed
- ✅ Best ideas identified
- ✅ Action items created

**Brainstorming Template**:
```markdown
## Brainstorm: [Topic/Problem]

### Problem Statement
[Clear description of what we're solving]

### Ideas Generated
1. [Idea 1] - [Brief description]
2. [Idea 2] - [Brief description]
3. [Idea 3] - [Brief description]
4. [Idea 4] - [Brief description]

### Evaluation Criteria
- [Criterion 1: e.g., Technical feasibility]
- [Criterion 2: e.g., User value]
- [Criterion 3: e.g., Development effort]

### Top Ideas
1. [Idea X]
   - Score: [X/10]
   - Why: [Justification]
   - Next: [Action]

### Decisions Made
- [Decision 1]
- [Decision 2]

### Next Steps
- [ ] [Action 1]
- [ ] [Action 2]
```

---

### Q&A

**Good Q&A sessions**:
- ✅ Question clearly stated
- ✅ Context provided
- ✅ Answer is actionable
- ✅ Examples provided
- ✅ Related docs referenced

**Q&A Template**:
```markdown
## Q&A: [Topic]

### Question
[Your specific question]

### Context
[Why you're asking, what you're trying to achieve]

### Answer
[Clear, actionable answer]

### Example
[Code example or usage example if applicable]

### Related Documentation
- [Reference 1]
- [Reference 2]

### Follow-up Questions
- [Question if any]
```

---

### Quick Fix

**Good quick fix sessions**:
- ✅ Issue clearly described
- ✅ Root cause identified
- ✅ Fix is minimal and focused
- ✅ Testing performed
- ✅ Documentation updated if needed

**Quick Fix Template**:
```markdown
## Quick Fix: [Issue]

### Issue Description
[What's wrong]

### Root Cause
[Why it's wrong]

### Fix Applied
[What was changed]

**Files Modified**:
- [file1.js:line] - [change]

### Testing
- [x] Fix verified locally
- [x] No regressions introduced
- [x] Related functionality still works

### Documentation
- [ ] Updated if needed
```

---

### Debugging Support

**Good debugging sessions**:
- ✅ Error message provided
- ✅ Steps to reproduce listed
- ✅ Expected vs actual behavior clear
- ✅ Root cause identified
- ✅ Solution provided with explanation

**Debugging Template**:
```markdown
## Debug: [Issue]

### Error Message
```
[Paste exact error]
```

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Investigation
[What was checked, what was found]

### Root Cause
[Why this is happening]

### Solution
[How to fix it]

### Prevention
[How to avoid this in future]
```

---

## Quality Guidelines

**For all general sessions**:

```
Clarity:
□ Question/objective is specific
□ Context is provided
□ Success criteria defined

Efficiency:
□ Token usage appropriate for task
□ No unnecessary exploration
□ Focused on objective

Actionability:
□ Clear next steps
□ Concrete recommendations
□ Examples provided

Documentation:
□ Answer/solution documented
□ Relevant files updated
□ Knowledge captured for future
```

---

## Common General Session Types

### 1. "How do I...?" Questions

**Pattern**:
```markdown
Question: How do I [task]?

Answer:
1. [Step 1 with code example]
2. [Step 2 with code example]
3. [Step 3 with code example]

Key Points:
- [Important note 1]
- [Important note 2]

Related Patterns:
- [Pattern 1 from CLAUDE.md]
- [Pattern 2 from codebase]

Example Usage:
```javascript
[Complete working example]
```
```

### 2. "Why is...?" Questions

**Pattern**:
```markdown
Question: Why is [behavior happening]?

Analysis:
[Explanation of the "why"]

Cause:
[Root cause]

Implications:
- [Implication 1]
- [Implication 2]

Should We Change It?
[Yes/No with reasoning]
```

### 3. "What's the best way to...?" Questions

**Pattern**:
```markdown
Question: What's the best way to [task]?

Options:
1. [Option 1] - [Pros/cons]
2. [Option 2] - [Pros/cons]

Recommendation:
[Option X] because [reasons]

Implementation:
[How to implement recommended approach]
```

---

## Post-Session Actions

After general session:

1. **Document Learning**:
   ```
   If valuable insight gained:
   □ Add to LESSONS_LEARNED.md
   □ Update CLAUDE.md if pattern emerged
   □ Update relevant docs if process clarified
   ```

2. **Update Session Log**:
   ```markdown
   | [Date] | General | [Xh] | [YK] | 0 | [Q/10] | [Category] | [Outcome] |
   ```

3. **Create Follow-up Tasks** (if needed):
   ```
   If research revealed action items:
   □ Create tickets
   □ Add to sprint backlog
   □ Update handoff document
   ```

4. **Rate Session** (1-10):
   - 10 = Question fully answered, highly actionable
   - 8-9 = Good answer, minor clarifications needed
   - 6-7 = Adequate but could be clearer
   - <6 = Question not adequately addressed

---

## Session Metrics

Track for general sessions:

- [ ] Question Resolution: 100% (all questions answered)
- [ ] Actionable Output: ≥70%
- [ ] Time Efficiency: Appropriate depth for question
- [ ] Token Usage: 20-40K (10-20%)
- [ ] Knowledge Captured: Documented for future

---

## Exit Criteria

- [ ] Question answered OR research documented OR bug root cause found
- [ ] Answer is clear and actionable
- [ ] Examples provided (if applicable)
- [ ] Escalation path suggested if complex (e.g., "use /coding" or "/quick-fix")
- [ ] SESSION_LOG.md updated (for substantial sessions)
- [ ] Session rating ≥8/10

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*general" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

This general session is successful when:
- ✅ Question/objective fully addressed
- ✅ Answer is clear and actionable
- ✅ Examples provided (if applicable)
- ✅ Context-appropriate depth
- ✅ Knowledge documented
- ✅ Session rating ≥8/10
- ✅ No follow-up confusion

---

## Important Notes

**General sessions should NOT**:
- ❌ Replace focused session types (use /coding for implementation)
- ❌ Exceed token budget (keep under 40K)
- ❌ Lack clear objective
- ❌ Leave questions unanswered
- ❌ Skip documentation

**General sessions SHOULD**:
- ✅ Be focused and specific
- ✅ Provide actionable answers
- ✅ Include examples
- ✅ Reference relevant docs
- ✅ Capture knowledge for future

---

**NOW BEGIN GENERAL SESSION**

Address the objective you stated above:
1. Provide clear, actionable answer/solution
2. Include examples if applicable
3. Reference relevant documentation
4. Document for future use

**Remember**: Quality over quantity. A focused, well-documented answer is better than broad, vague exploration.
