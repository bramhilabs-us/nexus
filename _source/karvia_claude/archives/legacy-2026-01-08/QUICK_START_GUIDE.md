# Quick Start Guide for Claude Sessions
**Fast reference for starting productive sessions**

---

## 🚀 Before Starting ANY Session

```markdown
1. Read these files (in order):
   ✓ .claude/SESSION_LOG.md - What's been done
   ✓ KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SPRINT3_HANDOFF_DOCUMENT.md - Current progress
   ✓ SESSION_BREAK_NOTES.md (if exists) - Where to restart

2. Identify session type:
   □ Strategy  - Planning, architecture, sprint setup
   □ Coding    - Feature implementation
   □ Audit     - Code review, quality check
   □ Testing   - Validation, bug detection
   □ General   - Questions, research, quick fixes

3. Set clear objectives:
   "I want to [specific goal] which will result in [output]"

4. Check token budget:
   • Strategy: 40-60K (20-30%)
   • Coding: 80-120K (40-60%)
   • Audit: 50-70K (25-35%)
   • Testing: 40-60K (20-30%)
   • General: 20-40K (10-20%)
```

---

## 📝 Session Starter Templates

### Strategy Session
```
**Session Type**: Strategy
**Sprint**: 3
**Focus**: [Epic/Feature name]

**Objective**: Plan [specific scope] with complete specifications

**Context**:
- Current Sprint Progress: [X/71 points]
- Last Session: [What was done]
- Blockers: [Any issues]

**Deliverables Expected**:
- [ ] Epic breakdown with story points
- [ ] Technical specifications
- [ ] Daily execution plan
- [ ] Risk assessment
- [ ] Handoff document updated

**Success Criteria**:
- All epics have acceptance criteria
- Technical specs complete enough to code from
- Dependencies identified
```

### Coding Session
```
**Session Type**: Coding
**Sprint**: 3
**Epic**: [Name] (X story points)

**Objective**: Implement [specific feature] according to specs

**Spec Reference**:
SPRINT-3-TECHNICAL-IMPLEMENTATION.md lines [X-Y]

**Files to Create/Modify**:
1. [file1.js] - [purpose]
2. [file2.js] - [purpose]

**Quality Gates**:
- [ ] XSS prevention (escapeHtml)
- [ ] Multi-tenant (company_id filtering)
- [ ] RBAC (requireRole middleware)
- [ ] Error handling (try/catch)
- [ ] Soft delete (status='cancelled')

**Success Criteria**:
- [ ] Feature works end-to-end
- [ ] All quality gates passed
- [ ] Handoff doc updated
- [ ] Session break notes created (if >60% tokens)
```

### Audit Session
```
**Session Type**: Audit
**Sprint**: 3
**Scope**: [Full sprint / Specific epic / Files]

**Objective**: Validate code quality and identify issues

**Audit Focus**:
- [ ] Security (XSS, SQL injection, secrets)
- [ ] Architecture (multi-tenancy, RBAC, patterns)
- [ ] Code quality (readability, duplication)
- [ ] Documentation (completeness, accuracy)
- [ ] Testing (coverage, edge cases)

**Files to Review**:
1. [file1.js]
2. [file2.js]

**Deliverable**: SPRINT_X_AUDIT_REPORT.md with:
- Critical issues (fix immediately)
- High issues (fix this sprint)
- Medium/Low issues (backlog)
- Quality rating (1-10)
```

### Testing Session
```
**Session Type**: Testing
**Sprint**: 3
**Test Type**: [BST / User Journey / Edge Cases]

**Objective**: Validate [feature/epic] functionality

**Test Plan**:
- Feature: [Name]
- Acceptance Criteria: [From user story]
- Test Cases: [N planned]

**Environment**: [Local / Dev / Staging]

**Success Criteria**:
- [ ] All test cases executed
- [ ] Pass rate ≥95%
- [ ] Bugs documented with severity
- [ ] Test report created
```

### General Session
```
**Session Type**: General
**Category**: [Research / Brainstorm / Quick Fix / Q&A]

**Objective**: [Specific question or task]

**Context**: [Background]

**Expected Output**: [What you need]
```

---

## ✅ During Session Checklist

```
Every 30 minutes:
□ Check token usage (aim for 70-90% by end)
□ Update handoff document with progress
□ Validate against success criteria
□ Document any decisions made

When reaching 60% tokens (120K):
□ Create SESSION_BREAK_NOTES.md
□ Document current state
□ Define restart point
□ List remaining work
```

---

## 🎯 After Session Checklist

```
□ Rate session quality (1-10)
□ Update SPRINT3_HANDOFF_DOCUMENT.md
□ Update .claude/SESSION_LOG.md
□ Create/update SESSION_BREAK_NOTES.md
□ Commit with proper format:

   type(sprint3): Description

   - Change 1
   - Change 2

   Epic X (Name) - Y points
   Sprint 3 Progress: A/71 points (B%)

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>

□ Identify next session type and objectives
```

---

## 🚨 Common Mistakes to Avoid

❌ **Don't**:
- Mix session types (strategy + coding)
- Start without reading handoff docs
- Skip quality gates in coding sessions
- Forget to update session log
- Use >95% tokens without break notes
- Create sprint docs outside SPRINT-3 folder
- Hardcode company-specific logic
- Skip multi-tenant filtering

✅ **Do**:
- Classify every session clearly
- Read context docs before starting
- Follow established patterns
- Update docs continuously
- Create break notes proactively
- Keep all sprint docs in SPRINT-3 folder
- Use feature flags for optional features
- Filter all queries by company_id

---

## 📊 Quality Self-Check

**Before marking session complete, verify**:

### Code Quality (for Coding sessions)
- [ ] No XSS vulnerabilities
- [ ] Multi-tenant isolation enforced
- [ ] RBAC properly implemented
- [ ] Error handling comprehensive
- [ ] No hardcoded secrets
- [ ] Follows established patterns

### Documentation Quality (all sessions)
- [ ] Handoff doc current
- [ ] Session log updated
- [ ] Clear next steps
- [ ] File references accurate
- [ ] Success criteria met

### Session Effectiveness
- [ ] Objectives achieved
- [ ] Token usage 70-90%
- [ ] Quality rating ≥8/10
- [ ] No blockers left unaddressed
- [ ] Next session planned

---

## 🎓 Pro Tips

1. **Front-load context**: Read all docs in first 10K tokens
2. **Parallel work**: Create multiple files in one session
3. **Progressive quality**: Working → Correct → Clean → Documented
4. **Early audits**: Check quality after each epic, not end of sprint
5. **Test while coding**: Don't wait for dedicated testing session
6. **Document decisions**: Capture "why" in comments and docs
7. **Break proactively**: Don't wait until 95% tokens to create break notes
8. **Link everything**: Reference files, lines, previous sessions

---

## 📚 Essential Reading

**Before any session**:
- [CLAUDE.md](../CLAUDE.md) - Codebase guide
- [.claude/SESSION_LOG.md](./.claude/SESSION_LOG.md) - Session history

**For strategy sessions**:
- [CLAUDE_STRATEGY.md](../CLAUDE_STRATEGY.md) - Overall strategy
- [.claude/Claude_Performance_Key_Metrics.md](./.claude/Claude_Performance_Key_Metrics.md) - Metrics framework

**For coding sessions**:
- Current sprint's TECHNICAL_IMPLEMENTATION.md
- Relevant USER_STORIES.md
- HANDOFF_DOCUMENT.md

**For audit sessions**:
- Quality gates in CLAUDE_STRATEGY.md
- Previous audit reports

---

## 🔗 Quick Links

- Sprint 3 Master Plan: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SPRINT-3-MASTER-PLAN.md`
- Handoff Doc: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SPRINT3_HANDOFF_DOCUMENT.md`
- Session Break Notes: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SESSION_BREAK_NOTES.md`
- Session Log: `.claude/SESSION_LOG.md`
- Metrics: `.claude/Claude_Performance_Key_Metrics.md`
- Strategy: `CLAUDE_STRATEGY.md`

---

**Remember**: Every great session starts with clarity, executes with focus, and finishes with quality. Use this guide to make that happen consistently.
