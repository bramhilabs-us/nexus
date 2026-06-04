# /audit - Audit Session Initialization

<!-- @GENOME T2-CMD-006 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/audit | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: AUDIT
**Token Budget**: ~900 AUTO
**Purpose**: Code review, quality validation, issue identification

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Security Reviewer | Vulnerability detection | XSS, auth checks |
| Architecture Reviewer | Pattern compliance | Code quality |
| Quality Analyst | Issue tracking | Audit tracker updates |

---

## Document Context

### AUTO (Read at session start) - ~900 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~400 | Security patterns, architecture |
| AUDIT_TRACKER.md | T2-GOV-003 | ~300 | Open findings, summary |
| Current sprint handoff | T3-SPR-xxx | ~200 | Recent completions |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| SESSION_LOG.md | T0-SES-001 | .claude/ |
| Sprint master plan | T3-SPR-xxx | Current sprint folder |
| Previous audit entries | - | AUDIT_TRACKER.md history |

### AVAILABLE (Exists, request on demand)

- Code files for review
- Test specifications
- Architecture decision records

---

## Step 0: Load Previous Audit State (MANDATORY)

Before doing ANY new audit work, you MUST:

1. **Read the Audit Tracker**:
   ```
   KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md
   ```

2. **Report previous audit status to the user**:
   - How many OPEN findings exist (by severity)
   - How many were FIXED since last audit
   - Whether any CRITICAL issues are still OPEN (blocks new work)

3. **Ask the user**: Do they want to:
   - (a) **Verify fixes** — Check if OPEN items have been resolved
   - (b) **New audit** — Conduct a fresh audit on a new scope
   - (c) **Both** — Verify old + audit new

4. **For verification**: Read the code at each OPEN finding's location and update status:
   - If fixed → change status to `FIXED` with date and resolution
   - If partially fixed → add note, keep `OPEN`
   - If still broken → keep `OPEN`, escalate if severity warrants

---

## Step 1: Context Loading

> Refer to Document Context section above for AUTO/LINKED docs.

**Additional context for specific audits:**
- Security audit: Read CLAUDE.md security patterns
- Architecture audit: Read CONTEXT_REGISTRY.md anti-patterns
- Sprint audit: Read sprint handoff for recent completions

---

## Step 2: Select Audit Scope

**Ask the user what to audit** (select scope):

- [ ] **Full Sprint Audit** - Review all work from current sprint
- [ ] **Epic Audit** - Review specific epic
- [ ] **Partial Audit** - Review specific files
- [ ] **Security Audit** - Focus on security vulnerabilities
- [ ] **Architecture Audit** - Focus on design patterns and structure
- [ ] **Documentation Audit** - Focus on completeness and accuracy
- [ ] **Sprint Plans Audit** - Review sprint plans for correctness

---

## Step 3: Audit Categories & Checklists

### 1. Security Audit

```
XSS Vulnerabilities:
□ Check all user input rendering for escapeHtml()
□ Verify no innerHTML with user data
□ Check API responses escape user content

Authentication/Authorization:
□ All protected routes have authenticateToken
□ Role-based routes use requireRole()
□ JWT validation implemented correctly
□ No auth bypass vulnerabilities

Multi-Tenancy:
□ All queries filter by company_id
□ No cross-tenant data leakage possible
□ Tenant isolation verified in all endpoints

Input Validation:
□ All user input validated
□ Rate limiting on sensitive endpoints

Secrets & Configuration:
□ No hardcoded API keys or secrets
□ Environment variables used properly
```

### 2. Architecture Audit

```
RESTful Design:
□ Proper HTTP verbs and status codes
□ Consistent naming conventions and response formats

Error Handling:
□ try/catch blocks present
□ Meaningful error messages
□ No exposed stack traces in production

Database Design:
□ Indexes on frequently queried fields
□ Proper schema design
□ No N+1 query issues

Service Layer:
□ Business logic in services, not routes
□ DRY principle followed
```

### 3. Code Quality Audit

```
□ No code duplication
□ No dead/unreachable code
□ No console.log() in production code
□ No magic numbers (use constants)
□ No TODOs without tickets
```

---

## Step 4: Issue Severity Classification

| Severity | Action | Description |
|----------|--------|-------------|
| **CRITICAL** | Fix immediately | Security vulnerability, data loss risk, production blocker |
| **HIGH** | Fix before sprint end | Major functionality broken, architectural violation |
| **MEDIUM** | Fix in current/next sprint | Minor bugs, inconsistent patterns |
| **LOW** | Backlog | Code style, minor improvements |

---

## Step 5: Record Findings in Audit Tracker

**IMPORTANT**: Do NOT create a new standalone audit report file.

Instead, **append all findings to the Audit Tracker**:
```
KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md
```

For each finding, add an entry in the appropriate severity section using this format:

```markdown
### A[C|H|M|L]-[next number]. [Issue Title]
- **Source**: [Audit type] [Date]
- **Status**: OPEN
- **Category**: [Security/Architecture/Code Quality/Testing/Documentation]
- **Location**: `[file:line]`
- **Impact**: [Description]
- **Fix**: [How to fix]
```

Also update the **Summary table** counts at the top of the tracker.

---

## Step 6: Provide Quality Scorecard

After completing the audit, provide this scorecard:

```markdown
## Quality Scorecard — [Date]

| Category | Score (1-10) | Notes |
|----------|--------------|-------|
| Security | [X] | |
| Architecture | [X] | |
| Code Quality | [X] | |
| Documentation | [X] | |
| Testing | [X] | |
| **Overall** | **[X]** | |
```

---

## Step 7: Update Session Log

Add entry to `.claude/SESSION_LOG.md`:

```markdown
| [Date] | Audit | [Xh] | [YK] | 0 | [Q/10] | Audit tracker updated | [scope], [N] new findings |
```

---

## Post-Audit Actions

### If CRITICAL issues found:
1. **STOP** - Do not proceed with new features
2. Recommend immediate coding session to fix
3. Update handoff document with blocker status

### If only High/Medium/Low issues found:
1. Prioritize in sprint backlog
2. Continue with planned work

---

---

## Exit Criteria

- [ ] All files in scope reviewed
- [ ] Issues categorized by severity
- [ ] Audit Tracker updated (not a new report file)
- [ ] Fix instructions provided for all issues
- [ ] Quality scorecard completed
- [ ] Session rating ≥8/10
- [ ] SESSION_LOG.md updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*audit" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

- All files in scope reviewed
- Issues categorized by severity
- **Audit Tracker updated** (not a new report file created)
- Fix instructions provided for all issues
- Quality scorecard completed
- Session rating >= 8/10
- No duplicate/overlapping audit documents created
