# Best Practices for Claude Code Sessions

<!-- @GENOME T2-ARC-003 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/init | linked:/coding,/strategy -->

**Version**: 1.0.0
**Last Updated**: January 8, 2026
**Status**: Active
**Owner**: BRAMHI_LABS

**Purpose**: Essential patterns for high-quality, productive interactions

---

## 🎯 Core Philosophy

**Every session should be**:
- **Purposeful** - Clear objectives from the start
- **Measurable** - Track metrics and quality
- **Documented** - Knowledge captured for future
- **Efficient** - Optimal use of token budget
- **High-Quality** - Meet or exceed standards (≥8/10)

**Remember**: It's better to complete 1 epic perfectly than 3 epics poorly.

---

## 📋 Session Lifecycle Best Practices

### 1. Starting Sessions

#### ✅ DO:
```
✓ Use /init command to load context
✓ Identify session type before starting (Strategy/Coding/Audit/Testing/General)
✓ Use session-specific slash command (/strategy, /coding, etc.)
✓ Read session log and handoff documents first
✓ Set clear, measurable objectives
✓ Define success criteria upfront
✓ Check token budget for session type
✓ Review relevant sprint documentation
```

#### ❌ DON'T:
```
✗ Start without reading session log
✗ Mix session types (strategy + coding in one session)
✗ Skip loading context from handoff documents
✗ Work without clear objectives
✗ Guess at what needs to be done
✗ Ignore session break notes if they exist
```

**Example - Good Start**:
```markdown
Used /init to review current state
Session Type: CODING
Epic: Epic 4 - AI-Assisted Planning (8 pts)
Objective: Implement AIContextService and AIObjectivePlanner
Token Budget: 80-120K
Success Criteria:
- [ ] AIContextService aggregates company context
- [ ] AIObjectivePlanner generates SMART key results
- [ ] POST /api/ai-okr/generate-plan working
```

**Example - Bad Start**:
```markdown
Let's add some AI features
[No context loaded, no specific goals, no success criteria]
```

---

### 2. During Sessions

#### ✅ DO:
```
Strategy Sessions:
✓ Create comprehensive documentation (master plan, technical specs, user stories)
✓ Break epics into specific, actionable tasks
✓ Estimate story points based on complexity + effort
✓ Identify dependencies and risks explicitly
✓ Provide file-level implementation guidance
✓ Stay within 40-60K token budget (20-30%)

Coding Sessions:
✓ Follow technical specifications exactly
✓ Check ALL security gates (XSS, multi-tenancy, RBAC, no secrets)
✓ Check ALL architecture gates (RESTful, error handling, patterns)
✓ Update handoff document continuously
✓ Create session break notes at 120K tokens (60%)
✓ Test functionality manually before marking complete
✓ Aim for 80-120K token usage (40-60%)

Audit Sessions:
✓ Review code systematically using checklists
✓ Rate every issue by severity (Critical/High/Medium/Low)
✓ Provide specific fix instructions with code examples
✓ Create comprehensive audit report
✓ Focus on finding issues, not fixing them
✓ Use 50-70K tokens (25-35%)

Testing Sessions:
✓ Execute planned test cases methodically
✓ Document every test result (PASS/FAIL/SKIPPED)
✓ Provide exact reproduction steps for bugs
✓ Rate bug severity accurately
✓ Create test execution report
✓ Use 40-60K tokens (20-30%)

General Sessions:
✓ State question/objective clearly
✓ Provide context and background
✓ Give actionable, specific answers
✓ Include code examples when applicable
✓ Reference relevant documentation
✓ Keep under 40K tokens (10-20%)
```

#### ❌ DON'T:
```
All Sessions:
✗ Exceed recommended token budget without break notes
✗ Skip documentation updates
✗ Leave work in broken state
✗ Forget to track metrics
✗ Mix session types

Coding Sessions:
✗ Skip security gates ("I'll add that later")
✗ Hardcode values that should be configurable
✗ Leave console.log() or debug code
✗ Create files without reading existing code first
✗ Ignore established patterns in codebase
✗ Skip error handling
✗ Use hard delete instead of soft delete (status='cancelled')

Strategy Sessions:
✗ Create vague, unactionable specifications
✗ Skip story point estimation
✗ Forget to identify dependencies
✗ Create specs without considering implementation complexity

Audit Sessions:
✗ Provide vague feedback ("this could be better")
✗ Skip severity ratings
✗ Find issues but not provide fix instructions
✗ Rush through code review

Testing Sessions:
✗ Mark tests as passed without actually running them
✗ Skip documenting bugs properly
✗ Test in production
✗ Lack reproduction steps
```

---

### 3. Closing Sessions

#### ✅ DO:
```
✓ Use /close command for proper closure
✓ Update session log with entry
✓ Update handoff document with progress
✓ Create session break notes if >60% tokens used
✓ Rate session quality (1-10)
✓ Commit code with proper message format
✓ Identify next session type and objectives
✓ Document any blockers encountered
✓ Capture lessons learned
✓ Verify all quality gates passed
```

#### ❌ DON'T:
```
✗ End session without updating documentation
✗ Skip session rating
✗ Leave work uncommitted
✗ Forget to plan next session
✗ Close with blockers undocumented
✗ Skip quality verification
```

**Example - Good Closure**:
```markdown
Session closed with /close command:
- Updated .claude/SESSION_LOG.md
- Updated sprint handoff document
- Created SESSION_BREAK_NOTES.md (token usage: 125K)
- Quality rating: 9/10
- Committed with proper format
- Next session: Coding (continue Epic 4)
```

---

## 🔒 Security Best Practices

### Must-Follow Security Patterns

```javascript
// ✅ CORRECT - XSS Prevention
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Display user input
element.textContent = escapeHtml(userInput);

// ❌ WRONG - XSS Vulnerability
element.innerHTML = userInput; // NEVER do this with user input
```

```javascript
// ✅ CORRECT - Multi-Tenant Isolation
const goals = await Goal.find({
  company_id: req.user.company_id,  // ALWAYS filter by company_id
  key_result_id: keyResultId
});

// ❌ WRONG - No tenant isolation
const goals = await Goal.find({
  key_result_id: keyResultId  // Missing company_id filter!
});
```

```javascript
// ✅ CORRECT - Role-Based Access Control
router.post('/objectives',
  authenticateToken,  // Verify JWT
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'),  // Check role
  async (req, res) => { ... }
);

// ❌ WRONG - No authorization
router.post('/objectives',
  authenticateToken,  // Only authentication, anyone can create objectives!
  async (req, res) => { ... }
);
```

```javascript
// ✅ CORRECT - No Hardcoded Secrets
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET not configured in production');
}

// ❌ WRONG - Hardcoded Secret
const jwtSecret = 'my-secret-key-123';  // NEVER hardcode secrets
```

### Security Checklist (Every Coding Session)

```
□ All user input escaped before rendering (escapeHtml)
□ All database queries filter by company_id
□ All protected routes have authenticateToken
□ Role-restricted routes have requireRole
□ No secrets hardcoded in code
□ Environment variables used for sensitive config
□ Input validation present (Joi schemas or custom)
□ File uploads validated (if applicable)
□ Rate limiting on sensitive endpoints
```

---

## 🏗️ Architecture Best Practices

### RESTful API Design

```javascript
// ✅ CORRECT - RESTful Design
GET    /api/goals/quarterly/:keyResultId          // Get all quarterly goals
POST   /api/goals/quarterly                       // Create quarterly goal
PUT    /api/goals/quarterly/:id                   // Update quarterly goal
DELETE /api/goals/quarterly/:id                   // Delete quarterly goal (soft)
PATCH  /api/goals/quarterly/:id/progress          // Update progress only

// ❌ WRONG - Non-RESTful
GET    /api/getQuarterlyGoals/:keyResultId
POST   /api/createQuarterlyGoal
POST   /api/updateQuarterlyGoal
POST   /api/deleteQuarterlyGoal
POST   /api/updateGoalProgress
```

### Error Handling

```javascript
// ✅ CORRECT - Comprehensive Error Handling
router.post('/goals/quarterly', authenticateToken, async (req, res) => {
  try {
    // Validation
    if (!req.body.name || !req.body.objective_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, objective_id'
      });
    }

    // Business logic
    const goal = new Goal({
      ...req.body,
      company_id: req.user.company_id,
      created_by: req.user._id
    });
    await goal.save();

    // Success response
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal
    });

  } catch (error) {
    logger.error('Error creating goal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create goal',
      message: error.message
    });
  }
});

// ❌ WRONG - No Error Handling
router.post('/goals/quarterly', authenticateToken, async (req, res) => {
  const goal = new Goal(req.body);  // What if this fails?
  await goal.save();  // What if database is down?
  res.json(goal);  // No error handling at all!
});
```

### Soft Delete Pattern

```javascript
// ✅ CORRECT - Soft Delete
router.delete('/goals/quarterly/:id', authenticateToken, async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  });

  if (!goal) {
    return res.status(404).json({
      success: false,
      error: 'Goal not found'
    });
  }

  // Soft delete - set status to cancelled
  goal.status = 'cancelled';
  goal.last_updated_by = req.user._id;
  await goal.save();

  res.json({
    success: true,
    message: 'Goal deleted successfully'
  });
});

// ❌ WRONG - Hard Delete
router.delete('/goals/quarterly/:id', authenticateToken, async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);  // Data lost forever!
  res.json({ success: true });
});
```

---

## 📝 Documentation Best Practices

### Code Comments

```javascript
// ✅ CORRECT - Explain WHY, not WHAT
/**
 * Uses proportional distribution to maintain goal alignment when parent dates change.
 * If parent objective moves from 12 months to 18 months, child goals expand
 * proportionally to fill the new timeframe while preserving relative spacing.
 */
async cascadeDateChange(parentGoal, newDates) {
  // ... implementation
}

// ❌ WRONG - States the obvious
// This function cascades date changes
async cascadeDateChange(parentGoal, newDates) {
  // Loop through child goals
  for (const child of children) {
    // Update the child goal dates
    child.start_date = newStart;
    child.end_date = newEnd;
  }
}
```

### Handoff Documentation

```markdown
<!-- ✅ CORRECT - Detailed Handoff -->
## Coding Session - Nov 23, 2025

### Completed Work
- ✅ Created AIContextService.js (server/services/AIContextService.js:1-245)
  - Aggregates company profile, SSI scores, existing objectives
  - Caches context for 1 hour to reduce database queries
  - Handles missing data gracefully with fallbacks

- ✅ Modified ai-okr.js (server/routes/ai-okr.js:250-310)
  - Added POST /api/ai-okr/generate-plan endpoint
  - Requires objectiveData in request body
  - Returns structured AI suggestions

### Key Decisions
1. Cached context for 1 hour (not 7 days) due to data freshness requirements
2. Used in-memory cache instead of Redis (feature flag not enabled)
3. Fallback to template-based suggestions if OpenAI unavailable

### Next Session
Continue with Epic 4:
- Create AIObjectivePlanner.js (OpenAI integration)
- Integrate frontend "Generate AI Plan" button
- Add caching for AI responses (7-day TTL)

Files to work on:
1. server/services/AIObjectivePlanner.js (create new)
2. client/pages/business-objectives.html (modify modal)
```

```markdown
<!-- ❌ WRONG - Vague Handoff -->
## Session

Worked on AI stuff. Created some files. Next time finish the AI thing.
```

---

## 🎯 Quality Best Practices

### Quality Rating Guidelines

```
10 = Exceptional
   - Production-ready code
   - Zero security issues
   - All patterns followed
   - Comprehensive error handling
   - Well documented
   - Tested and working
   - No technical debt introduced

9 = Excellent
   - High quality code
   - Minor improvements possible
   - All major patterns followed
   - Good error handling
   - Adequately documented

8 = Good (Minimum Target)
   - Meets all quality gates
   - Follows established patterns
   - Proper error handling
   - Basic documentation present
   - Works as expected

7 = Acceptable
   - Works but needs refinement
   - Some patterns inconsistent
   - Error handling incomplete
   - Documentation minimal

≤6 = Below Standard
   - Requires significant rework
   - Quality gates not met
   - Poor error handling
   - Insufficient documentation
```

**Target**: Maintain average ≥8.5 across all sessions

### Self-Review Checklist

Before rating a coding session, verify:

```
Security:
□ Ran mental "security audit" on all code written
□ No XSS vulnerabilities
□ Multi-tenant isolation enforced
□ RBAC properly applied
□ No hardcoded secrets

Architecture:
□ Follows RESTful conventions
□ Error handling comprehensive
□ Patterns consistent with codebase
□ Graceful degradation considered
□ Soft delete used

Code Quality:
□ No code duplication
□ No magic numbers
□ Meaningful names
□ No console.log() left
□ No commented-out code

Documentation:
□ Complex logic commented
□ Handoff document updated
□ API endpoints documented
□ Session break notes created (if >60% tokens)

Testing:
□ Manually tested functionality
□ Edge cases considered
□ Error scenarios tested
□ No obvious bugs

If all checkboxes: ≥8/10
If 1-2 missing: 7/10
If 3-4 missing: 6/10
If 5+ missing: ≤5/10
```

---

## ⏱️ Token Management Best Practices

### Token Budget Allocation

```
Strategy Session: 40-60K (20-30%)
- Why: Requires reading many docs, creating comprehensive plans
- Optimal: ~50K

Coding Session: 80-120K (40-60%)
- Why: Needs file reads, writes, testing, documentation
- Optimal: ~100K

Audit Session: 50-70K (25-35%)
- Why: Code review, issue identification, report creation
- Optimal: ~60K

Testing Session: 40-60K (20-30%)
- Why: Test execution, bug documentation, report creation
- Optimal: ~50K

General Session: 20-40K (10-20%)
- Why: Quick questions, research, small fixes
- Optimal: ~30K
```

### Token Checkpoints

```
At 30% (60K):
□ Review progress against objectives
□ Ensure on track to complete in budget
□ Adjust scope if needed

At 60% (120K):
□ CREATE SESSION_BREAK_NOTES.md immediately
□ Document exact restart point
□ List remaining work
□ Estimate effort to complete

At 75% (150K):
□ Plan to wrap up current file/task
□ No new features or files
□ Focus on documentation and closure

At 90% (180K):
□ Begin session closure process
□ Update all documentation
□ Commit work
□ Plan next session
```

### Session Break Best Practices

```markdown
<!-- ✅ CORRECT - Clear Restart Point -->
## Session Break - Nov 23, 2025
Token Usage: 125K/200K (62.5%)

### Completed
- ✅ AIContextService.js fully implemented and tested
- ✅ POST /api/ai-okr/generate-plan endpoint created
- ✅ API tested with Postman - working

### Current State
- Working on: AIObjectivePlanner.js
- Current file: server/services/AIObjectivePlanner.js
- Last completed: buildPrompt() method (line 89)
- Next: Implement callOpenAI() method (line 90-130)

### EXACT RESTART POINT
**START HERE**: Implement the callOpenAI() method in AIObjectivePlanner.js

Method signature:
```javascript
async callOpenAI(prompt) {
  // Call OpenAI API with prompt
  // Handle errors gracefully
  // Return structured response
}
```

Reference: SPRINT-3-TECHNICAL-IMPLEMENTATION.md lines 380-420 for specs

### Remaining Work
1. [ ] Complete callOpenAI() method (~30 min)
2. [ ] Implement parseResponse() method (~20 min)
3. [ ] Add error handling and fallbacks (~15 min)
4. [ ] Integration test (~15 min)
5. [ ] Update handoff document (~5 min)

Estimated: 1.5 hours, ~40K tokens
```

```markdown
<!-- ❌ WRONG - Vague Restart -->
## Session Break
Stopped working on AI stuff. Continue later.
[No specifics, no restart point, no remaining work listed]
```

---

## 🔄 Continuous Improvement Best Practices

### Weekly Review Process

```markdown
## Weekly Review - [Date Range]

### Metrics Summary
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Sessions | 8 | 7 | ↑ |
| Avg Quality | 9.1/10 | 8.8/10 | ↑ |
| Story Points | 24 | 21 | ↑ |
| Critical Bugs | 0 | 2 | ↓ |
| Token Efficiency | Optimal | Good | ↑ |

### What Went Well
- Consistent 9+ quality ratings
- Zero critical issues found in audits
- Session break notes working well
- Clear session type classification

### What Needs Improvement
- Testing sessions finding fewer edge cases
- Strategy sessions occasionally too detailed
- Need better estimation for story points

### Actions for Next Week
1. Add edge case testing checklist
2. Time-box strategy sessions to 50K tokens
3. Review story point estimation in retrospective

### Process Improvements
- Start using /init command consistently
- Create templates for common tasks
- Add more examples to best practices
```

### Lessons Learned Template

```markdown
## Lesson: [Title] - [Date]

### Context
[What was the situation]

### What We Learned
[Key insight]

### Why It Matters
[Impact and importance]

### How to Apply
[Specific actions for future sessions]

### Related
- Session: [Session where learned]
- Epic: [If epic-specific]
- Documentation: [Links to relevant docs]
```

---

## 🚫 Common Anti-Patterns to Avoid

### 1. The "I'll Fix It Later" Anti-Pattern

```
❌ WRONG:
"I'll add error handling later"
"I'll add security checks in the next session"
"I'll document this when I have time"

Result: Technical debt accumulates, quality degrades

✅ CORRECT:
Implement security, error handling, and documentation AS YOU CODE
Quality is not negotiable - it's part of "done"
```

### 2. The "Mixed Session" Anti-Pattern

```
❌ WRONG:
Starting as strategy session, then switching to coding, then doing audit
Session becomes unfocused, metrics unclear

✅ CORRECT:
One session = one type
Strategy → Close → Coding → Close → Audit
Clear boundaries, clear metrics
```

### 3. The "Token Wastage" Anti-Pattern

```
❌ WRONG:
- Reading entire files when only need small section
- Repeated reads of same documentation
- Exploring tangential topics
- Not using session break notes (hitting 95% tokens)

✅ CORRECT:
- Read specific line ranges
- Reference session log for context
- Stay focused on objectives
- Create break notes at 60% (120K tokens)
```

### 4. The "Specification Deviation" Anti-Pattern

```
❌ WRONG:
Coding session: "The spec says X, but Y seems better, I'll do Y"
Result: Inconsistency with plan, potential rework needed

✅ CORRECT:
If spec needs change:
1. Stop coding session
2. Create general session to discuss
3. Update specifications
4. Resume coding with new specs
```

### 5. The "Undocumented Decision" Anti-Pattern

```
❌ WRONG:
Making important architectural decisions during implementation
without documenting them in handoff or strategy docs

✅ CORRECT:
Document every decision with rationale:
"Chose in-memory cache over Redis because feature flag disabled.
Will switch to Redis when flag enabled. See .env.example."
```

---

## ✨ Success Indicators

**You're following best practices when**:

✅ Every session starts with /init or session-specific command
✅ Session type clearly identified before starting
✅ Objectives set and success criteria defined
✅ All quality gates passed (100% for security)
✅ Session log updated after every session
✅ Handoff document always current
✅ Session break notes created at 60% tokens (120K)
✅ Average quality rating ≥8.5/10
✅ Token usage within recommended range for session type
✅ Critical bugs found in audits, not production
✅ Documentation never lags behind code
✅ Next steps always clear

**Red flags indicating deviation from best practices**:

🚩 Starting sessions without loading context
🚩 Skipping quality gates ("I'll fix later")
🚩 Session log not updated
🚩 No session break notes when >60% tokens used
🚩 Quality ratings consistently <8/10
🚩 Token usage >95% without proper closure
🚩 Bugs found in production (not caught in testing)
🚩 Hardcoded values, secrets in code
🚩 Missing multi-tenant filtering
🚩 No error handling
🚩 Unclear next steps
🚩 Mixed session types

---

## 📚 Quick Reference

**Essential Commands**:
- `/init` - Load context and start session
- `/strategy` - Start strategy session
- `/coding` - Start coding session
- `/audit` - Start audit session
- `/testing` - Start testing session
- `/general` - Start general session
- `/close` - Close current session

**Essential Files**:
- `.claude/SESSION_LOG.md` - Session history
- Sprint handoff document (in current sprint folder) - Current progress
- `SESSION_BREAK_NOTES.md` - Restart instructions
- `CLAUDE.md` - Codebase guide
- `CLAUDE_STRATEGY.md` - Overall strategy
- `.claude/Claude_Performance_Key_Metrics.md` - Metrics framework

**Target Metrics**:
- Quality Rating: ≥8.5/10 average
- Security Gates: 100% compliance
- Test Pass Rate: ≥95%
- Documentation Coverage: 100%
- Critical Bugs: 0 in production

---

**Remember**: These best practices exist to make every session productive, measurable, and high-quality. Follow them consistently for optimal results.
