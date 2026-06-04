# KARVIA Business - Claude Checklist

**Version**: 1.1.0
**Last Updated**: March 6, 2026
**Status**: Active

---

## Purpose

Quick reference quality gates for every Claude session. Full details in [BEST_PRACTICES.md](./BEST_PRACTICES.md).

---

## Session Start Checklist

```
BEFORE STARTING WORK:
[ ] Read latest handoff from sessions/handoffs/
[ ] Check SESSION_LOG.md for context
[ ] Review README.md for commands
[ ] Use /init command to initialize
```

---

## During Session Checklist

### Security Gates (CRITICAL)

```
EVERY CODE CHANGE:
[ ] No hardcoded secrets (API keys, passwords)
[ ] No localhost URLs in production code
[ ] Input validation on all endpoints
[ ] Auth checks on protected routes
[ ] No SQL/NoSQL injection vulnerabilities
[ ] XSS prevention on user inputs
```

### Architecture Gates

```
STRUCTURAL CHANGES:
[ ] Follows existing patterns
[ ] Uses established naming conventions
[ ] Updates related documentation
[ ] No breaking changes without migration
[ ] Engine endpoints respect port allocation
```

### Documentation Gates

```
NEW FILES:
[ ] Proper header (Version, Date, Status)
[ ] Cross-references added
[ ] Follows MASTER_GUIDE.md placement rules
```

---

## Pre-Commit Checklist

```
BEFORE EVERY COMMIT:
[ ] Code compiles without errors
[ ] Tests pass (npm test)
[ ] No console.log debug statements
[ ] No TODO comments for critical items
[ ] Commit message is descriptive
[ ] No .env or secrets in commit
```

---

## Session End Checklist

```
BEFORE CLOSING SESSION:
[ ] All tasks completed or documented
[ ] Update SESSION_LOG.md with session entry
[ ] Create handoff document if needed
[ ] Update CHANGE_LOG.md with changes
[ ] Use /close command
```

---

## Quick Commands

| Command | Purpose |
|---------|---------|
| `/init` | Session initialization |
| `/strategy` | Planning sessions |
| `/coding` | Implementation |
| `/testing` | Test execution |
| `/audit` | Code review |
| `/design` | UI/UX design |
| `/close` | Session closure |

---

## Emergency Rollback

```bash
# Quick rollback steps
1. Go to Render dashboard
2. Select previous working deploy
3. Click "Redeploy"
4. Verify health checks pass
5. Document incident in CHANGE_LOG.md
```

---

## Related Documents

- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Full quality standards
- [README.md](./README.md) - Entry point and quick start
- [CONTEXT_REGISTRY.md](./CONTEXT_REGISTRY.md) - What to read before creating
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI/color patterns

---

**Document Status**: Active quality gates for KARVIA Business Claude sessions.
