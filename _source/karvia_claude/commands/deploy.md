# /deploy - Deployment Execution

<!-- @GENOME T2-CMD-009 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/deploy | linked:/release-audit,/quick-fix -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: OPS
**Token Budget**: ~1,200 AUTO
**Purpose**: Execute deployment to target environment

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| DevOps Engineer | Deployment | Commands, procedures |
| SRE | Reliability | Health checks |
| Release Manager | Oversight | Approval confirmation |

---

## Document Context

### AUTO (Read at session start) - ~1,200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| DEPLOYMENT_GUIDE.md | T2-OPS-003 | ~500 | Full procedures |
| RENDER_CONFIG.md | T2-OPS-004 | ~400 | Environment vars, URLs |
| Release approval | T3-SPR-xxx | ~300 | From /release-audit |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| Rollback procedure | - | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| Health check endpoints | - | API documentation |
| HOTFIX_PLAYBOOK.md | T2-OPS-005 | Same location |
| Current sprint handoff | T3-SPR-xxx | Current sprint folder |

### AVAILABLE (Exists, request on demand)

- Previous deployment logs
- Incident response playbook
- Full test report

---

## Prerequisites

Before running /deploy:

- [ ] /release-audit completed with GO decision
- [ ] Target environment confirmed
- [ ] Rollback plan understood

---

## Environment Matrix

| Environment | Render Service | Branch | URL |
|-------------|---------------|--------|-----|
| Development | karvia-business-1 | development | karvia-business-1.onrender.com |
| Pre-prod | karvia-business-2 | pre-prod | karvia-business-2.onrender.com |
| Production | karvia-business | production | karvia-business.onrender.com |

---

## Deployment Workflow

### Step 1: Pre-Deploy Verification

```
Prerequisites:
[ ] /release-audit completed and APPROVED
[ ] Target environment confirmed: [DEV|PRE-PROD|PROD]
[ ] Rollback plan confirmed
[ ] Team notified (if production)
```

### Step 2: Branch Operations

**For Development:**
```bash
# Ensure on development branch
git checkout development
git pull origin development
# Push if needed
git push origin development
```

**For Pre-prod:**
```bash
# Merge development to pre-prod
git checkout pre-prod
git pull origin pre-prod
git merge development --no-ff -m "Merge development for pre-prod deployment"
git push origin pre-prod
```

**For Production:**
```bash
# Merge pre-prod to production (CAREFUL!)
git checkout production
git pull origin production
git merge pre-prod --no-ff -m "Release: Sprint X deployment"
git push origin production
```

### Step 3: Monitor Deployment

Render auto-deploys on push. Monitor:

1. **Render Dashboard**: Check deploy logs
2. **Wait for "Live" status**: Usually 2-5 minutes
3. **Check for errors**: Build failures, startup crashes

### Step 4: Post-Deploy Validation

```bash
# Health check
curl https://[environment-url]/api/health

# Expected: {"status":"ok","timestamp":"..."}
```

**Smoke Tests:**
- [ ] Login works
- [ ] Dashboard loads
- [ ] Core API endpoints respond
- [ ] No console errors

### Step 5: Rollback (if needed)

**Immediate Rollback:**
```bash
# Revert the merge
git revert HEAD
git push origin [target-branch]
```

**Point-in-time Rollback (Render):**
1. Go to Render dashboard
2. Select service
3. Click "Manual Deploy"
4. Choose previous commit

### Step 6: Documentation

After successful deployment:

1. Update SESSION_LOG.md:
```markdown
| [Date] | Deploy | [0.5h] | [10K] | 0 | [10/10] | Deployed to [env] | [version/sprint] |
```

2. Update sprint handoff with deployment status

---

## Deployment Checklist

```
PRE-DEPLOY
[ ] Release audit: APPROVED
[ ] Target: [DEV/PRE-PROD/PROD]
[ ] Rollback plan: Confirmed

DEPLOY
[ ] Branch merged
[ ] Pushed to origin
[ ] Render deploy started
[ ] Render deploy completed (Live)

POST-DEPLOY
[ ] Health check: PASS
[ ] Smoke tests: PASS
[ ] No new errors in logs
[ ] Documentation updated

ROLLBACK (if needed)
[ ] Issue identified
[ ] Rollback executed
[ ] Verified rollback success
[ ] Incident documented
```

---

## Environment-Specific Notes

### Development (karvia-business-1)
- Safe for experimental features
- Can deploy directly from development branch
- Auto-deploys on every push to `development`

### Pre-prod (karvia-business-2)
- Staging environment for QA
- Should mirror production
- Run full test suite here

### Production (karvia-business)
- **CAREFUL**: Affects real users
- Requires /release-audit GO decision
- Notify team before deploying
- Monitor closely for 15+ minutes after deploy

---

## Exit Criteria

- [ ] Deployment completed successfully
- [ ] Health checks passing
- [ ] Smoke tests passed
- [ ] No new errors in logs
- [ ] Rollback plan confirmed (if issues arise)
- [ ] Deployment logged in SESSION_LOG.md
- [ ] Sprint handoff updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*deploy" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

This deployment session is successful when:
- ✅ Code deployed to target environment
- ✅ All health checks pass
- ✅ Smoke tests verify functionality
- ✅ No rollback required
- ✅ Documentation updated
- ✅ Session rating ≥8/10

---

**NOW BEGIN DEPLOYMENT**

1. Confirm target environment
2. Verify /release-audit GO decision
3. Execute deployment steps
4. Validate and document

**Remember**: Production deployments require extra care. When in doubt, deploy to pre-prod first.
