# /quick-fix - Emergency Hotfix

<!-- @GENOME T2-CMD-010 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/quick-fix | linked:/deploy -->

**Aliases**: /hotfix
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: OPS
**Token Budget**: ~800 AUTO
**Purpose**: Rapid response to production issues

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| On-call Developer | Rapid diagnosis | Quick fixes |
| SRE | Production access | Logs, metrics |
| QA (lightweight) | Targeted testing | Regression check |

---

## Document Context

### AUTO (Read at session start) - ~800 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| CLAUDE.md | T0-GOV-001 | ~300 | §Security Patterns only |
| HOTFIX_PLAYBOOK.md | T2-OPS-005 | ~300 | Quick-fix protocol |
| Last deployment record | T3-OPS-xxx | ~200 | What's in prod |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Full test plan | T3-TST-xxx | Current sprint folder |
| Rollback procedure | - | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| DEPLOYMENT_GUIDE.md | T2-OPS-003 | Same location |
| Current sprint handoff | T3-SPR-xxx | Current sprint folder |

### AVAILABLE (Exists, request on demand)

- Error logs (from user or monitoring)
- Full codebase
- Previous hotfix records
- Recent commits: `git log --oneline -20`

---

## When to Use /quick-fix

Use this command for:
- **P0**: Production is down or severely degraded
- **P1**: Major functionality broken, users impacted
- **P2**: Annoying bug, workaround exists

Do NOT use for:
- New features (use /coding)
- Refactoring (use /coding)
- Non-urgent improvements (use /coding)

---

## Quick-Fix Protocol

### Step 1: IDENTIFY (5 min max)

```
Issue Assessment:
- What's broken? [Description]
- Severity: [ ] P0 (down) [ ] P1 (degraded) [ ] P2 (annoying)
- Affected users: [ ] All [ ] Some [ ] Few
- When did it start? [Time]
- Correlates with last deploy? [ ] Yes [ ] No
```

**Recent Deploys:**
```bash
git log --oneline -10 --date=short
```

### Step 2: ISOLATE (10 min max)

```
Root Cause Analysis:
- Which file(s)? [List]
- Which function(s)? [List]
- Root cause hypothesis: [Describe]
```

**Quick Grep:**
```bash
# Search for error message
grep -r "error text" server/ client/

# Check recent changes
git diff HEAD~5 -- [suspected-file]
```

### Step 3: FIX (minimal change only)

**CRITICAL RULES:**
- ❌ NO refactoring
- ❌ NO "while we're here" improvements
- ❌ NO unrelated changes
- ✅ ONLY fix the specific bug
- ✅ Add regression test if possible

```
Fix Applied:
- File: [file:line]
- Change: [Description]
- Lines modified: [N]
```

### Step 4: TEST (targeted only)

```
Testing Checklist:
[ ] Fix verified locally
[ ] Affected feature works
[ ] No obvious regressions
[ ] Related features still work
```

**Run targeted tests:**
```bash
# If test exists
npm test -- --grep "[test-name]"

# Manual verification
npm run dev:server
# Test the specific scenario
```

### Step 5: DEPLOY (expedited path)

**Severity-based deployment:**

| Severity | Path |
|----------|------|
| P0 | Direct to production (with approval) |
| P1 | Pre-prod → quick validation → production |
| P2 | Normal deployment cycle |

```bash
# Commit the fix
git add [file]
git commit -m "fix: [Brief description]

Root cause: [1 line]
Resolution: [1 line]

🚨 Hotfix for [P0/P1/P2] issue
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to branch
git push origin [branch]
```

### Step 6: VERIFY

After deployment:

```
Verification:
[ ] Fix confirmed in production
[ ] Monitor for 15 minutes
[ ] Check error rates (if monitoring available)
[ ] No new issues introduced
```

### Step 7: DOCUMENT

```markdown
## Hotfix Log Entry

**Date**: [Date]
**Issue**: [Brief description]
**Severity**: [P0/P1/P2]
**Root Cause**: [1-2 sentences]
**Fix**: [File:line - change]
**Deploy Time**: [HH:MM]
**Verified**: [Yes/No]
**Follow-up**: [Ticket # if deeper work needed]
```

Update SESSION_LOG.md:
```markdown
| [Date] | Quick-fix | [0.5h] | [20K] | 0 (fix) | [9/10] | [Issue] hotfix | [P0/P1/P2], [env] deployed |
```

---

## Quick Reference

### Common Production Issues

| Symptom | Likely Cause | Check First |
|---------|--------------|-------------|
| 500 errors | Backend crash | server logs |
| Blank page | JS error | browser console |
| Auth failing | Token issue | JWT/cookie |
| Data not loading | API timeout | network tab |
| Wrong data | Query bug | database |

### Emergency Commands

```bash
# Check recent changes
git log --oneline -10

# See what's in production
git log production --oneline -5

# Quick rollback
git revert HEAD
git push origin [branch]

# Check server logs (local)
npm run dev:server 2>&1 | tee server.log
```

---

## Exit Criteria

- [ ] Root cause identified
- [ ] Minimal fix applied (no extra changes)
- [ ] Targeted tests pass
- [ ] Fix deployed to affected environment
- [ ] Issue verified resolved
- [ ] Follow-up ticket created (if deeper work needed)
- [ ] Incident logged in SESSION_LOG.md

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*quick-fix" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

This quick-fix session is successful when:
- ✅ Issue resolved with minimal code change
- ✅ No new bugs introduced
- ✅ Fix deployed and verified
- ✅ Incident documented
- ✅ Session rating ≥8/10

---

**NOW BEGIN QUICK-FIX**

1. **IDENTIFY**: What's broken?
2. **ISOLATE**: Which file(s)?
3. **FIX**: Minimal change only
4. **TEST**: Targeted validation
5. **DEPLOY**: Expedited path
6. **VERIFY**: Confirm resolution
7. **DOCUMENT**: Log the incident

**Remember**: Speed is important, but correctness is critical. A bad fix is worse than no fix.
