# /coding - Coding Session Initialization

<!-- @GENOME T2-CMD-004 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: CODING
**Token Budget**: ~1,800 AUTO
**Purpose**: Feature implementation, bug fixes, production code

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Backend Developer | API/Database | Implementation patterns |
| Frontend Developer | UI/UX | Client-side patterns |
| Quality Engineer | Testing | Validation criteria |

---

## Document Context

### AUTO (Read at session start) - ~1,800 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~600 | Technical patterns, API design |
| CONTEXT_REGISTRY.md | T2-ARC-001 | ~400 | Domain references, anti-patterns |
| Current sprint handoff | T3-SPR-xxx | ~500 | Progress, next tasks |
| Session break notes | T3-SES-xxx | ~300 | If exists, restart point |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Technical implementation | T3-SPR-xxx | Current sprint folder |
| User stories | T3-SPR-xxx | Current sprint folder |
| Sprint master plan | T3-SPR-xxx | Current sprint folder |

### AVAILABLE (Exists, request on demand)

- Related model files
- Existing service patterns
- Test specifications

---

## What Are You Implementing?

**Epic/Feature**: [Name]
**Story Points**: [X]
**Priority**: [P0/P1/P2]

**Scope** (Check all that apply):
- [ ] Backend (models, routes, services, middleware)
- [ ] Frontend (HTML, CSS, JavaScript)
- [ ] Database changes (schema, migrations)
- [ ] API endpoints (new routes)
- [ ] Bug fixes (specify: [issue])
- [ ] Refactoring (specify: [area])

**Files to Create**:
1. [file1.js] - [purpose]
2. [file2.js] - [purpose]

**Files to Modify**:
1. [file1.js] - [changes needed]
2. [file2.js] - [changes needed]

---

## Coding Session Quality Gates

**EVERY file you create/modify MUST pass these gates**:

### 🔒 Security Gate
```
□ XSS Prevention - All user input escaped with escapeHtml()
□ Multi-Tenant Isolation - All queries filter by company_id
□ RBAC Enforcement - Protected routes use requireRole() middleware
□ JWT Validation - authenticateToken on protected endpoints
□ Input Validation - Joi schemas or custom validators
□ No Hardcoded Secrets - Use environment variables
□ SQL Injection Prevention - Parameterized queries only
```

### 🏗️ Architecture Gate
```
□ RESTful Conventions - Proper HTTP verbs (GET/POST/PUT/DELETE/PATCH)
□ Error Handling - try/catch blocks, error middleware
□ Graceful Degradation - Feature flags for optional features
□ Database Optimization - Indexes, lean queries, proper population
□ Soft Delete Pattern - Use status='cancelled', never hard delete
□ Service Layer Separation - Business logic in services, not routes
□ Consistent Patterns - Follow existing codebase patterns
```

### 📝 Documentation Gate
```
□ Code Comments - Complex logic explained
□ Handoff Document - Updated with implementation details
□ Session Break Notes - Created if >60% tokens (120K)
□ API Documentation - New endpoints documented
□ Acceptance Criteria - Validated and checked off
```

### 🧪 Testing Gate
```
□ Manual Testing - Feature tested locally
□ Critical Paths - Core functionality validated
□ Edge Cases - Boundary conditions considered
□ Error Scenarios - Error handling tested
□ No Obvious Bugs - Basic smoke testing passed
```

---

## Implementation Process

Follow this sequence:

### 1. Backend First (if applicable)
```
Step 1: Models
□ Update/create Mongoose models
□ Add validation rules
□ Create indexes
□ Add virtuals/methods if needed

Step 2: Services
□ Create service layer for business logic
□ Implement core functionality
□ Add error handling
□ Use feature flags for optional features

Step 3: Routes
□ Create RESTful endpoints
□ Add authentication (authenticateToken)
□ Add authorization (requireRole)
□ Validate input
□ Call service layer
□ Handle errors properly

Step 4: Middleware (if needed)
□ Create custom middleware
□ Add to appropriate routes
```

### 2. Frontend (if applicable)
```
Step 1: HTML Structure
□ Create/update HTML pages
□ Add semantic markup
□ Include proper scripts/styles

Step 2: JavaScript Logic
□ Create API client calls
□ Add event handlers
□ Implement UI logic
□ Add loading states
□ Handle errors gracefully
□ Escape all user input (XSS prevention)

Step 3: Styling
□ Add/update CSS
□ Ensure responsive design
□ Match existing UI patterns
```

### 3. Integration
```
□ Connect frontend to backend
□ Test end-to-end flow
□ Verify data persistence
□ Check error scenarios
```

---

## Session Metrics (Track These)

As you code, track:
- [ ] Code Quality: Target ≥95%
- [ ] Sprint Adherence: Target ≥90% (follow specs)
- [ ] Security Gates: Target 100% (all passed)
- [ ] Documentation: Target 100% (handoff updated)
- [ ] Token Usage: Track continuously (aim for 80-120K)

**Token Checkpoints**:
- At 60K (30%): Quick progress check
- At 90K (45%): Evaluate if epic will fit in session
- At 120K (60%): **CREATE SESSION_BREAK_NOTES.md**
- At 150K (75%): Plan to wrap up current file
- At 180K (90%): Begin session closure

---

## Post-Implementation Checklist

After coding, before marking complete:

### 1. Quality Verification
```
□ All security gates passed
□ All architecture gates passed
□ All documentation gates passed
□ Code follows existing patterns
□ No console.log() or debug code left
□ No commented-out code (unless documented why)
```

### 2. Documentation Updates
```
□ Update SPRINTX_HANDOFF_DOCUMENT.md:
   - Mark epic/files as complete
   - Document any deviations from spec
   - Note any issues encountered
   - Update progress percentage

□ Create/update SESSION_BREAK_NOTES.md if:
   - Token usage >60% (120K)
   - Epic not fully complete
   - Need to continue in next session

□ Update .claude/SESSION_LOG.md:
   | [Date] | Coding | [Xh] | [YK] | [Z pts] | [Q/10] | [Files] | [Notes] |
```

### 3. Testing
```
□ Feature works as expected
□ Error handling works
□ Edge cases handled
□ No console errors
□ Multi-tenancy verified (if applicable)
□ Role-based access works (if applicable)
```

### 4. Git Commit
```bash
git add .
git commit -m "feat(sprintX): [Epic/Feature name]

- Implemented [feature 1]
- Created [file 1]
- Modified [file 2]
- Fixed [issue] (if any)

Epic X ([Name]) - [Y] story points
Sprint X Progress: [A]/[B] points ([C%])

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Rate This Session (1-10)

Before closing, rate the session:

| Rating | Quality Level | Description |
|--------|---------------|-------------|
| 10 | Exceptional | Production-ready, zero issues, all gates passed |
| 9 | Excellent | Minor improvements possible, high quality |
| 8 | Good | Meets standards, small refinements needed |
| 7 | Acceptable | Functional but needs improvement |
| 6 | Below Standard | Significant issues, requires rework |
| ≤5 | Unacceptable | Major problems, complete rework needed |

**Target**: ≥8/10

**My Rating**: [X/10]
**Reason**: [Why this rating]
**Improvements for next time**: [What could be better]

---

## Success Criteria

This coding session is successful when:
- ✅ Epic/feature fully implemented
- ✅ All quality gates passed (100%)
- ✅ Handoff document updated
- ✅ Session rating ≥8/10
- ✅ Code committed with proper message
- ✅ Session break notes created (if needed)
- ✅ Next session identified (Audit/Testing/Coding continuation)

---

---

## Exit Criteria

- [ ] Epic/feature fully implemented
- [ ] All quality gates passed (100%)
- [ ] Handoff document updated
- [ ] Session rating ≥8/10
- [ ] Code committed with proper message
- [ ] Session break notes created (if needed)
- [ ] Next session identified

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*coding" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

**NOW BEGIN CODING**

Implement the epic/feature you identified above, following:
1. Security gates (100% compliance)
2. Architecture gates (proper patterns)
3. Progressive quality (working → correct → clean → documented)
4. Token management (create break notes at 120K)
5. Continuous documentation updates

**Remember**: Quality over speed. Better to complete 1 epic perfectly than 3 epics poorly.
