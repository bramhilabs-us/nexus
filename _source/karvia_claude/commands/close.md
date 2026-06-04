# /close - Session Closure

<!-- @GENOME T2-CMD-002 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/close | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: CLOSE
**Token Budget**: ~200 AUTO
**Purpose**: Session closure with documentation, metrics, and handoff for next session

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Session Closer | Documentation | Metrics capture |
| Handoff Author | Context transfer | Restart clarity |

---

## Document Context

### AUTO (Read at session start) - ~200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| SESSION_LOG.md | T0-SES-001 | ~100 | Last entry format |
| Current sprint handoff | T3-SPR-xxx | ~100 | Current progress section |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Session break notes | T3-SES-xxx | Current sprint folder |
| LESSONS_LEARNED.md | T3-SES-xxx | .claude/ |

### AVAILABLE (Exists, request on demand)

- Previous session entries
- Sprint master plan

---

## IMPORTANT: This is an AUTOMATED WORKFLOW

**Claude MUST execute each step sequentially. This command captures session metrics, updates documentation, and prepares handoff for the next session.**

---

## Session Closure Checklist

### 1. Session Type Identification

**What session type are you closing?**
- [ ] Strategy
- [ ] Coding
- [ ] Audit
- [ ] Testing
- [ ] General

**Session started**: [Date/Time]
**Session ending**: [Date/Time]
**Duration**: [X hours]

---

### 2. Session Metrics Collection

**Collect these metrics before closing**:

```
Token Usage:
- Total tokens used: [X]/200K ([Y%])
- Efficiency rating: [Good/Optimal/Wasteful]

Work Completed:
- Objectives achieved: [List]
- Files created/modified: [N]
- Story points completed: [X] (for coding sessions)
- Issues found: [N] (for audit/testing sessions)

Quality Assessment:
- Self-rating (1-10): [X]
- Quality gates passed: [Y/N for each gate]
- Critical issues: [N]
- Blockers encountered: [Yes/No]
```

---

### 3. Documentation Updates

**Update all required documentation**:

#### A. Session Log Update

Add entry to `.claude/SESSION_LOG.md`:

```markdown
| [Date] | [Type] | [Xh] | [YK tokens] | [Z pts] | [Q/10] | [Outputs] | [Notes] |
```

**Example**:
```markdown
| Nov 23 | Coding | 3h | 110K | 24 | 9/10 | Epic 1+2 complete | Date system + OKR control |
```

#### B. Handoff Document Update

Update the current sprint's handoff document (found via /init):

```markdown
## [Session Type] Session - [Date]

### Completed Work
- [x] [Item 1] - [file.js:lines]
- [x] [Item 2] - [file.js:lines]

### Key Changes
1. [Change 1] - [Description]
2. [Change 2] - [Description]

### Progress Update
- Story Points: [X]/71 ([Y%])
- Days Complete: [X]/10 ([Y%])

### Next Session Recommendation
- Type: [Session type]
- Focus: [What to work on]
- Prerequisites: [Any dependencies]
```

#### C. Session Break Notes (if >60% tokens)

If token usage exceeded 120K (60%), create/update `SESSION_BREAK_NOTES.md`:

```markdown
## Session Break - [Date]
**Session Type**: [Type]
**Token Usage**: [X]K/200K ([Y%])
**Status**: [In progress / Complete]

### What Was Completed
- [Completed item 1]
- [Completed item 2]

### Current State
- Working on: [Current task]
- Files modified: [List]
- Last file/line: [file.js:line]

### Restart Point
**EXACT NEXT STEP**: [Precise instruction for next session]

### Files to Continue
1. [file1.js] - [What needs to be done]
2. [file2.js] - [What needs to be done]

### Context Needed for Restart
- [Context item 1]
- [Context item 2]

### Estimated Remaining Effort
- [X] story points remaining
- [Y] hours estimated
```

---

### 4. Quality Verification

**Before closing, verify quality**:

#### For Coding Sessions:
```
Security Gates:
□ XSS prevention implemented
□ Multi-tenant isolation enforced
□ RBAC properly applied
□ No hardcoded secrets

Architecture Gates:
□ RESTful conventions followed
□ Error handling comprehensive
□ Graceful degradation implemented
□ Patterns consistent with codebase

Documentation Gates:
□ Handoff document updated
□ Code comments added where needed
□ API docs updated (if new endpoints)
□ Session break notes created (if needed)

Testing Gates:
□ Manual testing performed
□ Critical paths validated
□ No obvious bugs
```

#### For Audit Sessions:
```
□ All files in scope reviewed
□ Issues categorized by severity
□ Audit Tracker updated (NOT a new report file)
□ Fix instructions provided
□ Quality scorecard completed
□ No duplicate/overlapping audit documents created (run dedup check below)
```

**Audit Document Deduplication Check (MANDATORY for audit sessions)**:
1. Search for any new `*AUDIT*` or `*audit*` files created during this session
2. If any standalone audit report was created, **merge its findings into the Audit Tracker** at:
   `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md`
3. Move the standalone file to the archive:
   `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/sprints/archive/audit-reports/`
4. Verify the Audit Tracker summary table counts are accurate
5. Confirm: only ONE audit document is the source of truth (the Tracker)

#### For Testing Sessions:
```
□ All planned test cases executed
□ Pass/fail results documented
□ Bugs have reproduction steps
□ Test report created
□ Coverage target met
```

#### For Strategy Sessions:
```
□ All epics have story points
□ Technical specs complete
□ Dependencies identified
□ Risks documented
□ Next steps clear
```

---

### 5. Git Commit (if applicable)

**If code/docs were created/modified**:

```bash
git add .
git commit -m "type(sprint3): [Description]

- [Change 1]
- [Change 2]
- [Change 3]

[Epic/Session info]
Sprint [X] Progress: [A]/[B] points ([Y%])

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Commit type**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

---

### 6. Session Rating

**Rate this session (1-10)**:

| Rating | Description |
|--------|-------------|
| 10 | Exceptional - All objectives met, zero issues, exemplary quality |
| 9 | Excellent - Minor improvements possible, high quality |
| 8 | Good - Meets standards, small refinements needed |
| 7 | Acceptable - Functional but needs improvement |
| 6 | Below Standard - Significant issues, requires rework |
| ≤5 | Unacceptable - Major problems, complete rework needed |

**My Rating**: [X]/10

**Reasoning**:
- Positive: [What went well]
- Negative: [What could improve]
- Blockers: [Any issues encountered]

---

### 7. Next Session Planning

**Recommend next session**:

```markdown
## Next Session Recommendation

**Type**: [Strategy/Coding/Audit/Testing/General]
**Focus**: [Specific epic/task/area]
**Estimated Duration**: [X hours]
**Token Budget**: [X-Y]K
**Priority**: [P0/P1/P2]

**Prerequisites**:
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

**Objectives**:
1. [Objective 1]
2. [Objective 2]

**Success Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Files/Areas Involved**:
- [file1.js] - [purpose]
- [file2.js] - [purpose]
```

---

### 8. Knowledge Capture

**If valuable insights gained**:

Add to `.claude/LESSONS_LEARNED.md` (create if doesn't exist):

```markdown
## Session [Date] - [Type]

### What Worked Well
- [Pattern/approach that was effective]
- [Tool/technique that helped]

### What Didn't Work
- [Anti-pattern encountered]
- [Inefficiency identified]

### Key Learning
[Main insight from this session]

### Process Improvement
[How to improve next similar session]

### Technical Insight
[Technical knowledge gained]
```

---

### 9. Blockers & Issues

**Document any blockers encountered**:

```markdown
### Blockers Found

1. **[Blocker 1]**
   - Impact: [Description]
   - Workaround: [If any]
   - Resolution needed: [Action required]
   - Priority: [Critical/High/Medium/Low]

2. **[Blocker 2]**
   - Impact: [Description]
   - Workaround: [If any]
   - Resolution needed: [Action required]
   - Priority: [Critical/High/Medium/Low]
```

**If critical blockers**:
- [ ] Update handoff with BLOCKER status
- [ ] Create CRITICAL_FIXES.md if needed
- [ ] Alert stakeholders if production impact

---

### 10. Session Summary

**Provide concise session summary**:

```markdown
## Session Summary - [Date]

**Type**: [Session type]
**Duration**: [X hours]
**Token Usage**: [Y]K ([Z%])
**Quality**: [X/10]

**Achievements**:
- [Achievement 1]
- [Achievement 2]

**Outputs**:
- [Output 1]
- [Output 2]

**Metrics**:
- Story Points: [X] (for coding)
- Issues Found: [N] (for audit)
- Tests Passed: [X%] (for testing)

**Status**: [On track / Behind / Ahead / Blocked]

**Next**: [Next session type and focus]
```

---

## Final Checklist

Before considering session closed:

```
Documentation:
□ Session log updated
□ Handoff document updated
□ Session break notes created (if >60% tokens)
□ Lessons learned captured (if applicable)

Quality:
□ Quality gates verified (for session type)
□ Session rated (1-10)
□ Issues/blockers documented

Code (if applicable):
□ Changes committed with proper message
□ No uncommitted work
□ No debug code left

Planning:
□ Next session identified
□ Prerequisites listed
□ Objectives clear

Handoff:
□ Current state documented
□ Restart point clear (if continuing work)
□ No missing context
```

---

## Session Closed Successfully ✓

**Summary**:
- Session Type: [Type]
- Quality Rating: [X/10]
- Token Usage: [Y]K ([Z%])
- Status: [Complete/In Progress]
- Next Session: [Type - Focus]

**The session is now properly closed with all documentation updated and handoff prepared.**

---

## Quick Sync Validation

> **Purpose**: Verify documentation is consistent before closing.

### Quick Sync Check

```bash
# Verify genome tags match session matrix
grep "auto:.*close" --include="*.md" .claude/ KARVIA_STRATEGY/

# Expected: SESSION_LOG.md should appear
```

### Sequence Suggestion

Based on session type, suggest next session:

| Current Session | Likely Next |
|-----------------|-------------|
| Strategy | /coding |
| Coding | /testing or /audit |
| Audit | /coding (to fix) |
| Testing | /coding (to fix) or /close (if pass) |
| Design | /coding |

---

## Exit Criteria

- [ ] SESSION_LOG.md updated with session entry
- [ ] Handoff document updated with progress
- [ ] Session break notes created (if >60% tokens)
- [ ] Quality rating assigned (1-10)
- [ ] Next session recommended
- [ ] Git commit created (if code changed)

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*close" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

**Use `/init` to start the next session with full context.**
