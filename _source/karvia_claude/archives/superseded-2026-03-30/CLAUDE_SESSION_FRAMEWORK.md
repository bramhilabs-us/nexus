# Claude Session Framework

> A portable guide for structured Claude Code sessions. Drop this file into any codebase to establish consistent, high-quality AI-assisted development.

## Quick Reference

| Session Type | Token Budget | When to Use |
|-------------|--------------|-------------|
| Strategy | 20-30% | Sprint planning, architecture, specifications |
| Coding | 40-60% | Feature implementation, bug fixes |
| Audit | 25-35% | Code review, quality validation |
| Testing | 20-30% | Test execution, bug detection |
| General | 10-20% | Research, questions, quick fixes |

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   START ──► CLASSIFY ──► EXECUTE ──► DOCUMENT ──► CLOSE    │
│      │          │            │            │           │     │
│      ▼          ▼            ▼            ▼           ▼     │
│   Read       Identify     Follow      Update      Create    │
│   Context    Session      Type's      Logs &      Handoff   │
│   Files      Type         Process     Track       Notes     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Session Templates

### 1. Strategy Session

**Purpose**: Planning, architecture decisions, specifications

**Start Template**:
```
Session Type: STRATEGY
Objective: [What are we planning?]
Scope: [Which components/features?]
Deliverables: [Specs, diagrams, plans]
```

**Checklist**:
- [ ] Define clear objectives
- [ ] Identify constraints and dependencies
- [ ] Create actionable specifications
- [ ] Document decisions and rationale
- [ ] Break into implementable chunks

**Quality Metrics**:
- Specifications completeness: ≥90%
- Actionable items identified: All
- Dependencies mapped: Complete
- Time estimates: Realistic

---

### 2. Coding Session

**Purpose**: Feature implementation, bug fixes, refactoring

**Start Template**:
```
Session Type: CODING
Task: [What are we building/fixing?]
Files: [Which files will be modified?]
Acceptance Criteria: [How do we know it's done?]
```

**Pre-Implementation Checklist**:
- [ ] Read relevant files first (NEVER edit unread files)
- [ ] Understand existing patterns
- [ ] Identify all touch points
- [ ] Plan changes before coding

**During Implementation**:
- [ ] Follow existing code patterns
- [ ] Keep changes minimal and focused
- [ ] Handle errors appropriately
- [ ] Validate multi-tenant isolation (if applicable)
- [ ] Check for security issues (XSS, injection, etc.)

**Post-Implementation**:
- [ ] Verify changes work
- [ ] Update any affected tests
- [ ] Document what was changed
- [ ] Create handoff notes

**Quality Gates**:
- ✅ Security: No vulnerabilities introduced
- ✅ Patterns: Follows codebase conventions
- ✅ Minimal: Only necessary changes made
- ✅ Tested: Critical paths validated

---

### 3. Audit Session

**Purpose**: Code review, quality validation, issue detection

**Start Template**:
```
Session Type: AUDIT
Scope: [What are we reviewing?]
Focus Areas: [Security, performance, patterns, etc.]
Output: [List of issues with severity]
```

**Audit Categories**:

| Category | What to Check |
|----------|---------------|
| Security | XSS, injection, auth bypass, data exposure |
| Architecture | Patterns, separation of concerns, coupling |
| Performance | N+1 queries, memory leaks, inefficient loops |
| Error Handling | Try/catch, graceful degradation, user feedback |
| Code Quality | Readability, duplication, naming conventions |

**Severity Ratings**:
- **Critical**: Security vulnerabilities, data corruption risks
- **High**: Bugs that break functionality
- **Medium**: Performance issues, code smells
- **Low**: Style issues, minor improvements

**Output Format**:
```
## Audit Results

### Critical Issues
1. [File:Line] Description - Recommendation

### High Priority
1. [File:Line] Description - Recommendation

### Medium Priority
...

### Summary
- Total issues found: X
- Critical: X, High: X, Medium: X, Low: X
- Recommended actions: [List]
```

---

### 4. Testing Session

**Purpose**: Test execution, bug detection, validation

**Start Template**:
```
Session Type: TESTING
Scope: [What are we testing?]
Test Types: [Unit, integration, E2E, manual]
Expected Coverage: [Which scenarios?]
```

**Testing Checklist**:
- [ ] Happy path scenarios
- [ ] Edge cases and boundaries
- [ ] Error scenarios
- [ ] Permission/role variations
- [ ] Data validation

**Bug Report Format**:
```
## Bug: [Title]
**Severity**: Critical/High/Medium/Low
**Steps to Reproduce**:
1. ...
2. ...
**Expected**: ...
**Actual**: ...
**Files Involved**: ...
**Suggested Fix**: ...
```

---

### 5. General Session

**Purpose**: Research, questions, quick fixes, exploration

**Start Template**:
```
Session Type: GENERAL
Question/Task: [What do we need?]
Context: [Any relevant background]
```

**Best Practices**:
- Keep questions focused
- Provide context when asking
- For quick fixes, still read files first
- Document findings for future reference

---

## Core Principles

### 1. Intentionality
Every session has a clear purpose. Define it upfront.

### 2. Read Before Write
**NEVER** edit a file you haven't read. Understand existing code first.

### 3. Minimal Changes
Only change what's necessary. Avoid scope creep.

### 4. Pattern Following
Match existing codebase conventions, don't introduce new patterns unnecessarily.

### 5. Documentation as Code
If you learned something important, document it for the next session.

---

## Session Documentation

### Handoff Document Template

Create/update after significant work:

```markdown
# Session Handoff

## Date: YYYY-MM-DD

## Completed
- [x] Task 1
- [x] Task 2

## In Progress
- [ ] Task 3 (70% complete)

## Blocked
- [ ] Task 4 - Waiting on [dependency]

## Next Steps
1. First priority
2. Second priority

## Notes
- Important discoveries
- Gotchas to remember
- Decisions made and why
```

### Session Break Notes

When stopping mid-task:

```markdown
# Session Break Notes

## Current State
[Where exactly did we stop?]

## Context
[What do we need to remember?]

## To Resume
1. [First thing to do]
2. [Second thing to do]

## Open Questions
- [Anything unresolved?]
```

---

## Quality Standards

### Code Quality Checklist

Before considering any coding task complete:

- [ ] **Security**: No XSS, injection, or auth vulnerabilities
- [ ] **Error Handling**: All errors caught and handled gracefully
- [ ] **Logging**: Appropriate logging for debugging
- [ ] **Performance**: No obvious performance issues
- [ ] **Readability**: Code is clear and self-documenting
- [ ] **Testing**: Critical paths have test coverage
- [ ] **Documentation**: Complex logic is commented

### Communication Standards

- Be direct and concise
- Use code blocks for code
- Reference file:line when discussing specific code
- Provide rationale for decisions
- Ask clarifying questions early

---

## Setup for New Codebase

### Required Files

Create these files in your project:

```
.claude/
├── QUICK_START_GUIDE.md    # This file (or link to it)
├── SESSION_LOG.md          # Track session history
└── [PROJECT]_CONTEXT.md    # Project-specific context
```

### PROJECT_CONTEXT.md Template

```markdown
# Project Context

## Overview
[What is this project?]

## Architecture
[High-level architecture description]

## Key Files
- `path/to/file.js` - Description
- `path/to/other.js` - Description

## Common Patterns
[Code patterns used in this project]

## Important Commands
```bash
npm run dev    # Start development
npm test       # Run tests
```

## Known Constraints
- [Constraint 1]
- [Constraint 2]
```

### SESSION_LOG.md Template

```markdown
# Session Log

## Session: YYYY-MM-DD HH:MM
**Type**: [Strategy/Coding/Audit/Testing/General]
**Objective**: [What was the goal?]
**Outcome**: [What was achieved?]
**Quality Rating**: X/10
**Notes**: [Key learnings]

---

## Session: YYYY-MM-DD HH:MM
...
```

---

## Pro Tips

1. **Start with context**: Read handoff docs and session logs first
2. **Classify immediately**: Know what type of session before starting
3. **Set clear objectives**: "Explore the codebase" is not a good objective
4. **Time-box exploration**: Don't spend 50% of tokens understanding, leave room for action
5. **Document as you go**: Don't wait until the end to document
6. **Create checkpoints**: For long tasks, document progress at natural breakpoints
7. **Quality over quantity**: Better to do one thing well than three things poorly
8. **Ask early**: If something is unclear, ask before guessing

---

## Token Budget Guidelines

| Activity | Recommended % |
|----------|---------------|
| Context gathering | 10-20% |
| Planning/Design | 10-15% |
| Implementation | 40-60% |
| Validation | 10-15% |
| Documentation | 5-10% |

**Signs of token waste**:
- Re-reading the same files multiple times
- Extensive exploration without clear objective
- Long explanations when code would suffice
- Unnecessary refactoring

---

## Emergency Procedures

### If Running Out of Context
1. Immediately document current state
2. Create detailed session break notes
3. List exact next steps
4. Save any uncommitted changes

### If Stuck on a Problem
1. Step back and document what you know
2. Break problem into smaller pieces
3. Ask for clarification if needed
4. Consider alternative approaches

### If Something Broke
1. Don't panic
2. Document what happened
3. Check git status/diff
4. Revert if necessary
5. Approach with fresh strategy

---

## Version

**Framework Version**: 1.0.0
**Last Updated**: December 2024
**Compatible With**: Claude Code, Claude API

---

*This framework is designed to be codebase-agnostic. Customize the PROJECT_CONTEXT.md for your specific project needs.*
