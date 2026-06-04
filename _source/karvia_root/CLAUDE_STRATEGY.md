# CLAUDE_STRATEGY.md
**Comprehensive Strategy for Maximizing Claude Code Effectiveness**

---

## 🎯 Vision

**Transform every Claude interaction into a high-value, measurable contribution toward product excellence.**

Every session with Claude Code should:
- Have a clear, measurable objective
- Follow established patterns and standards
- Produce quality, production-ready outputs
- Move the codebase closer to the product vision
- Leave the project in a better state than it started

---

## 📋 Table of Contents

1. [Core Principles](#core-principles)
2. [Session Framework](#session-framework)
3. [Quality Standards](#quality-standards)
4. [Communication Patterns](#communication-patterns)
5. [Context Management](#context-management)
6. [Continuous Improvement](#continuous-improvement)
7. [Best Practices](#best-practices)

---

## 🌟 Core Principles

### 1. **Intentionality Over Improvisation**
- Every session has a defined type (Strategy/Coding/Audit/Testing/General)
- Clear objectives set before starting
- Success criteria established upfront
- Metrics tracked throughout

### 2. **Documentation as Code**
- All decisions documented in real-time
- Handoff documents updated continuously
- Session break notes created proactively
- Knowledge captured, not lost

### 3. **Quality Over Quantity**
- Better to complete 3 features perfectly than 10 features poorly
- Every output reviewed against standards
- Security, architecture, and patterns validated
- Technical debt avoided, not accumulated

### 4. **Progressive Elaboration**
- Start with high-level strategy
- Elaborate into detailed specifications
- Implement with precision
- Audit and refine continuously

### 5. **Fail-Fast Feedback Loops**
- Identify issues early through audits
- Test frequently during development
- Fix bugs immediately when found
- Don't accumulate technical debt

---

## 🔄 Session Framework

### Session Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                   SESSION PLANNING                      │
│  • Identify session type                               │
│  • Define clear objectives                             │
│  • Review relevant docs                                │
│  • Estimate token budget                               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  SESSION EXECUTION                      │
│  • Follow session-specific metrics                     │
│  • Track progress in real-time                         │
│  • Document decisions continuously                     │
│  • Monitor token usage                                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  SESSION CLOSURE                        │
│  • Rate session quality (1-10)                         │
│  • Update handoff documents                            │
│  • Create session break notes                          │
│  • Identify next session needs                         │
│  • Commit with proper format                           │
└─────────────────────────────────────────────────────────┘
```

### Session Type Selection Guide

| Scenario | Recommended Type | Primary Focus |
|----------|-----------------|---------------|
| Starting new sprint | **Strategy** | Planning, architecture, specifications |
| Implementing features | **Coding** | Building, following specs, quality code |
| End of sprint | **Audit** | Review, validation, quality assurance |
| Before deployment | **Testing** | Validation, bug detection, user journeys |
| Questions, research | **General** | Exploration, problem-solving, quick fixes |

### Optimal Session Sequence

**Sprint Start** (Week 1):
1. **Strategy Session** (Day 1) - Complete sprint planning
2. **Coding Session** (Day 1-2) - Implement Epic 1
3. **Audit Session** (Day 2) - Quick quality check
4. **Coding Session** (Day 2-3) - Implement Epic 2
5. **Testing Session** (Day 3) - Validate Epic 1 & 2

**Sprint Middle** (Week 2):
1. **Coding Session** (Day 4-5) - Continue implementation
2. **General Session** (Day 5) - Address questions, issues
3. **Audit Session** (Day 5) - Mid-sprint review
4. **Coding Session** (Day 6-7) - Complete remaining epics
5. **Testing Session** (Day 7) - Full sprint validation

**Sprint End** (Week 2-3):
1. **Audit Session** (Day 8) - Comprehensive audit
2. **Coding Session** (Day 8-9) - Fix critical issues
3. **Testing Session** (Day 9) - Final validation
4. **Strategy Session** (Day 10) - Plan next sprint

---

## ✅ Quality Standards

### Code Quality Gates

**Every coding session output must pass:**

#### Security Gate
```
✓ No XSS vulnerabilities (all user input escaped)
✓ Multi-tenant isolation enforced (company_id filtering)
✓ RBAC implemented (requireRole middleware)
✓ No hardcoded secrets
✓ Input validation present
✓ JWT validation on protected routes
```

#### Architecture Gate
```
✓ Follows RESTful conventions
✓ Proper error handling (try/catch, error middleware)
✓ Graceful degradation (feature flags)
✓ Database queries optimized
✓ Soft delete pattern used
✓ Service layer separation
```

#### Documentation Gate
```
✓ Handoff document updated
✓ Code comments for complex logic
✓ API endpoints documented
✓ Session break notes created (if >50% tokens used)
✓ Acceptance criteria validated
```

#### Testing Gate
```
✓ Critical paths have tests
✓ Edge cases considered
✓ Manual testing performed
✓ No obvious bugs
```

### Quality Rating System

**Rate every session output (1-10)**:

| Score | Quality Level | Description |
|-------|--------------|-------------|
| 10 | Exceptional | Production-ready, zero issues, exemplary quality |
| 9 | Excellent | Minor improvements possible, high quality |
| 8 | Good | Meets standards, small refinements needed |
| 7 | Acceptable | Functional but needs improvement |
| 6 | Below Standard | Significant issues, requires rework |
| ≤5 | Unacceptable | Major problems, complete rework needed |

**Target**: Maintain average ≥ 8.5 across all sessions.

---

## 💬 Communication Patterns

### Effective Prompting

**BAD** ❌:
> "Fix the login page"

**GOOD** ✅:
> "This is a CODING SESSION for Sprint 3, Epic 5. Implement the login page according to SPRINT-3-TECHNICAL-IMPLEMENTATION.md lines 450-520. Requirements: JWT authentication, role-based redirect, remember me functionality, error handling. Use the authentication patterns from server/middleware/auth.js. Update SPRINT3_HANDOFF_DOCUMENT.md when complete."

### Structured Communication Template

```markdown
**Session Type**: [Strategy/Coding/Audit/Testing/General]
**Sprint**: [Number]
**Epic/Task**: [Name and reference]

**Objective**: [Clear, specific goal]

**Context**:
- Current state: [What exists]
- Desired state: [What you want]
- Constraints: [Limitations, requirements]

**References**:
- [Document 1]
- [File 1:line-range]
- [Previous session output]

**Success Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Deliverables Expected**:
- [ ] [Output 1]
- [ ] [Output 2]
```

### Context Provision

**Always provide**:
1. **Session type** - Sets expectations for metrics and outputs
2. **Current sprint/epic** - Provides strategic context
3. **Relevant documentation** - Links to specs, plans, previous sessions
4. **File references** - Specific paths and line numbers
5. **Success criteria** - Clear definition of "done"

---

## 🧠 Context Management

### Token Budget Strategy

**200K Token Budget Allocation**:

| Session Type | Recommended Budget | Rationale |
|--------------|-------------------|-----------|
| Strategy | 40-60K (20-30%) | Comprehensive planning requires reading many docs |
| Coding | 80-120K (40-60%) | Implementation needs file reads, writes, testing |
| Audit | 50-70K (25-35%) | Review code, identify issues, create reports |
| Testing | 40-60K (20-30%) | Execute tests, document results |
| General | 20-40K (10-20%) | Quick questions, research, small fixes |

### Session Break Points

**Create session break notes when**:
- Token usage exceeds 60% (120K)
- Logical boundary reached (epic complete)
- Complex context needs fresh start
- Multiple independent tasks remain

**Session break notes must include**:
1. What was completed (with file references)
2. Current state of the codebase
3. Exactly where to restart ("Start with Epic 4, file X")
4. Dependencies and prerequisites
5. Estimated effort remaining
6. Success criteria for next session

### Context Preservation

**Always update these files during sessions**:
- `SPRINTX_HANDOFF_DOCUMENT.md` - Progress tracking
- `SESSION_BREAK_NOTES.md` - Restart instructions
- Relevant sprint docs (if plans change)
- Audit reports (if issues found)

---

## 📈 Continuous Improvement

### Weekly Review Process

**Every Friday or Sprint End**:

```markdown
## Weekly Review - [Date Range]

### Metrics Review
- Sessions conducted: [N]
- Story points completed: [X]
- Average quality rating: [X/10]
- Critical issues found: [N]
- Critical issues fixed: [N]
- Token efficiency: [Good/Optimal/Wasteful]

### What Went Well
- [Success 1]
- [Success 2]

### What Needs Improvement
- [Issue 1] → [Action to address]
- [Issue 2] → [Action to address]

### Process Improvements
- [Improvement 1]
- [Improvement 2]

### Next Week Adjustments
- [Change 1]
- [Change 2]
```

### Learning Capture

**Maintain a LESSONS_LEARNED.md**:

```markdown
## Sprint X Lessons

### Technical Learnings
- [Learning 1]: [Description and context]
- [Learning 2]: [Description and context]

### Process Learnings
- [Learning 1]: [Description and context]
- [Learning 2]: [Description and context]

### Claude Interaction Patterns
- **What worked well**: [Pattern]
- **What didn't work**: [Anti-pattern]
- **Optimization**: [How to improve]
```

### Metrics Dashboard

**Track in a spreadsheet or markdown table**:

| Week | Sessions | Tokens Used | Story Points | Quality Avg | Critical Bugs | Notes |
|------|----------|-------------|--------------|-------------|---------------|-------|
| W1 | 8 | 185K | 24 | 9.1 | 0 | Excellent start |
| W2 | 7 | 170K | 21 | 8.8 | 2 | Fixed immediately |
| W3 | 9 | 195K | 27 | 9.3 | 0 | Peak performance |

---

## 🎯 Best Practices

### 1. Start Every Session Right

**Pre-Session Checklist**:
```
□ Read SPRINTX_HANDOFF_DOCUMENT.md
□ Review SESSION_BREAK_NOTES.md (if exists)
□ Understand current sprint goals
□ Identify session type
□ Define clear objectives
□ Gather relevant file references
□ Set success criteria
```

### 2. Maintain Focus

**During Session**:
- Stay within session type scope
- Don't mix strategy and coding in one session
- If context shifts, acknowledge and adjust
- Track progress against success criteria
- Update handoff doc in real-time

### 3. Handle Session Blockers

**If you encounter**:

| Blocker | Action |
|---------|--------|
| Unclear requirements | Switch to General session for clarification |
| Complex bug | Create detailed bug report, plan Audit session |
| Missing dependency | Document in handoff, plan next session |
| Token budget low | Create session break notes immediately |
| Scope creep | Refocus on original objectives |

### 4. End Every Session Well

**Post-Session Checklist**:
```
□ Rate session quality (1-10)
□ Update SPRINTX_HANDOFF_DOCUMENT.md
□ Create/update SESSION_BREAK_NOTES.md
□ Commit with proper message format
□ Identify next session type and objectives
□ Document any blockers or questions
□ Save session log entry
```

### 5. Optimize for Iteration

**Progressive refinement approach**:
1. **First pass**: Get it working
2. **Second pass**: Make it right (patterns, security)
3. **Third pass**: Make it clean (refactor, optimize)
4. **Fourth pass**: Make it documented

Don't try to achieve perfection in one session.

### 6. Leverage Session Specialization

**Strategy sessions should NOT**:
- Write production code
- Fix bugs
- Run tests
- Get lost in implementation details

**Coding sessions should NOT**:
- Change strategic direction
- Redesign architecture mid-implementation
- Skip specifications
- Ignore established patterns

**Audit sessions should NOT**:
- Implement fixes (document them instead)
- Rush through reviews
- Miss critical issues
- Provide vague feedback

**Testing sessions should NOT**:
- Skip documentation
- Ignore failing tests
- Test in production
- Lack reproduction steps

### 7. Documentation Excellence

**Every document must have**:
- Clear title and purpose
- Date and sprint reference
- Structured sections with headers
- Actionable content
- Links to related documents
- Next steps clearly defined

**Bad documentation** ❌:
> "Some issues were found. Fix them later."

**Good documentation** ✅:
> ```
> ## Audit Session - Nov 23, 2025
> ### Critical Issues Found: 3
>
> 1. **SQL Injection in /api/goals**
>    - Location: server/routes/goals.js:145
>    - Severity: CRITICAL
>    - Impact: Database compromise possible
>    - Fix: Use parameterized queries
>    - Estimated effort: 30 minutes
>    - Assigned to: Next coding session
> ```

### 8. Commit Message Standards

**Format**:
```
type(scope): Description

- Detailed change 1
- Detailed change 2
- Reference to epic/issue

Epic X (Name) - Y story points
Sprint N Progress: A/B points (C%)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: feat, fix, docs, style, refactor, test, chore

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create session log spreadsheet
- [ ] Set up session templates
- [ ] Establish quality gates
- [ ] Define baseline metrics

### Phase 2: Practice (Weeks 2-3)
- [ ] Conduct sessions with clear type classification
- [ ] Track metrics consistently
- [ ] Create handoff docs after each session
- [ ] Rate session quality

### Phase 3: Refinement (Weeks 4-6)
- [ ] Analyze session metrics
- [ ] Identify patterns in high-quality sessions
- [ ] Adjust templates and processes
- [ ] Optimize token usage

### Phase 4: Mastery (Ongoing)
- [ ] Maintain ≥8.5 average quality rating
- [ ] Minimize critical bugs (≤1 per sprint)
- [ ] Achieve 90%+ token efficiency
- [ ] Document best practices
- [ ] Continuously improve

---

## 📊 Success Indicators

**You're succeeding when**:

✅ Every session has clear type and objectives
✅ Average quality rating ≥ 8.5/10
✅ Handoff documents always current
✅ Session break notes created proactively
✅ Token usage 70-90% per session
✅ Critical bugs found in audits, not production
✅ Story points completed match estimates
✅ Documentation never lags behind code
✅ Next steps always clear
✅ Product vision getting closer each week

**Red flags to watch for**:

🚩 Mixing session types (strategy + coding in one session)
🚩 Quality ratings consistently <8
🚩 Token usage >95% or <50%
🚩 Handoff docs out of date
🚩 Bugs found in production
🚩 Unclear next steps
🚩 Scope creep in sessions
🚩 Documentation gaps
🚩 No session metrics tracked

---

## 🎓 Advanced Strategies

### 1. Parallel Session Planning

**For complex sprints, plan sessions in parallel**:
```
Day 1 Morning:   Strategy Session (Epic 1-3 planning)
Day 1 Afternoon: Coding Session (Epic 1 implementation)
Day 2 Morning:   Audit Session (Epic 1 review)
Day 2 Afternoon: Coding Session (Epic 2 implementation)
```

### 2. Session Chaining

**Link related sessions with clear handoffs**:
```
Strategy → Coding → Audit → Coding (fixes) → Testing → Strategy (next sprint)
```

### 3. Quality Feedback Loops

**Immediate feedback**:
- Audit after each epic completion
- Test after each major feature
- Fix critical issues before moving forward

### 4. Context Reuse

**Save token budget by**:
- Creating comprehensive session break notes
- Referencing specific file:line locations
- Building on previous session outputs
- Using CLAUDE.md as base context

### 5. Strategic Batching

**Batch similar tasks in one session**:
- Multiple API endpoints in one coding session
- Multiple files in one audit session
- Multiple user journeys in one testing session

---

## 📝 Template Library

All session templates available in `.claude/templates/`:
- `strategy_session_template.md`
- `coding_session_template.md`
- `audit_session_template.md`
- `testing_session_template.md`
- `general_session_template.md`
- `weekly_review_template.md`
- `session_log_template.md`

---

## 🔗 Related Documents

- [Claude Performance Key Metrics](./.claude/Claude_Performance_Key_Metrics.md)
- [CLAUDE.md](./CLAUDE.md) - Codebase guide for Claude
- [SPRINT3_HANDOFF_DOCUMENT](./KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SPRINT3_HANDOFF_DOCUMENT.md)
- [SESSION_BREAK_NOTES](./KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SESSION_BREAK_NOTES.md)

---

## 🎯 The Ultimate Goal

**Every Claude session should be**:
- **Purposeful** - Clear objectives and success criteria
- **Measurable** - Tracked metrics and quality ratings
- **Productive** - Tangible outputs that move project forward
- **High-Quality** - Meets or exceeds standards (≥8/10)
- **Well-Documented** - Future sessions can build on it
- **Iterative** - Each session makes the next one better

**When you consistently achieve this, you've mastered working with Claude Code.**

---

**Remember**: The goal isn't perfection in every session. The goal is continuous improvement, measurable progress, and sustainable velocity toward your product vision.

**Start with clarity. Execute with focus. Finish with quality. Repeat.**
