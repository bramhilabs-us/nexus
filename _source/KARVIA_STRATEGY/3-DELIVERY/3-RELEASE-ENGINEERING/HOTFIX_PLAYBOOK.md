# Hotfix Playbook

<!-- @GENOME T2-OPS-005 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/quick-fix | linked:/deploy -->

**Version**: 1.0.0
**Last Updated**: March 30, 2026
**Purpose**: Emergency response procedures for production issues

---

## Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **P0** | Production down | Immediate | Site unreachable, auth broken |
| **P1** | Major degradation | Within 1 hour | Key feature broken, data issues |
| **P2** | Minor issue | Within 4 hours | UI glitch, edge case bug |

---

## Quick Response Protocol

### 1. IDENTIFY (5 min max)
```
What's broken? _____________________
Severity: [ ] P0  [ ] P1  [ ] P2
Affected users: [ ] All  [ ] Some  [ ] Few
Started when? _____________________
Correlates with deploy? [ ] Yes  [ ] No
```

### 2. ISOLATE (10 min max)
```
File(s): _____________________
Function(s): _____________________
Root cause: _____________________
```

### 3. FIX (minimal change only)
```
- NO refactoring
- NO "while we're here" improvements
- ONLY fix the specific bug
```

### 4. TEST (targeted)
```bash
# Run related tests
npm test -- --grep "[test-name]"

# Manual smoke test
npm run dev:server
```

### 5. DEPLOY (expedited)

| Severity | Deployment Path |
|----------|-----------------|
| P0 | Direct to production (with approval) |
| P1 | Pre-prod → Quick validation → Production |
| P2 | Normal deployment cycle |

### 6. VERIFY
```
[ ] Fix confirmed in production
[ ] Monitor for 15 minutes
[ ] No new issues
```

### 7. DOCUMENT
```
[ ] SESSION_LOG.md updated
[ ] Follow-up ticket created (if needed)
[ ] Incident logged
```

---

## Emergency Commands

```bash
# Check recent changes
git log --oneline -10

# Quick rollback
git revert HEAD
git push origin [branch]

# Check server logs
npm run dev:server 2>&1 | tee server.log
```

---

## Common Issues & Fixes

| Symptom | Likely Cause | Check First |
|---------|--------------|-------------|
| 500 errors | Backend crash | Server logs |
| Blank page | JS error | Browser console |
| Auth failing | Token issue | JWT/cookie |
| Data not loading | API timeout | Network tab |

---

## Escalation Path

1. **On-call Developer**: Initial response
2. **Tech Lead**: P0/P1 approval
3. **Product Owner**: User communication

---

## Post-Incident Review

After resolution:

1. **Document root cause**
2. **Create follow-up ticket** for proper fix (if hotfix was temporary)
3. **Update playbook** with new learnings
4. **Share findings** with team

---

## Related Commands

- `/quick-fix` - Emergency hotfix session
- `/deploy` - Deployment execution
- `/release-audit` - Pre-deployment checks
