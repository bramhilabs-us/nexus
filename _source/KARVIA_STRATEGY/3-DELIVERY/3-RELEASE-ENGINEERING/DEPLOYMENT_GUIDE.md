# Deployment Guide

<!-- @GENOME T2-OPS-003 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/deploy | linked:/release-audit,/quick-fix -->

**Version**: 1.0.0
**Last Updated**: March 30, 2026
**Purpose**: Consolidated deployment procedures for Karvia Business

---

## Quick Reference

| Environment | Render Service | Branch | URL |
|-------------|---------------|--------|-----|
| Development | karvia-business-1 | development | karvia-business-1.onrender.com |
| Pre-prod | karvia-business-2 | pre-prod | karvia-business-2.onrender.com |
| Production | karvia-business | production | karvia-business.onrender.com |

---

## Deployment Paths

### Development Deployment
```bash
# Auto-deploys on push
git checkout development
git push origin development
```

### Pre-prod Deployment
```bash
git checkout pre-prod
git pull origin pre-prod
git merge development --no-ff -m "Merge development for pre-prod"
git push origin pre-prod
```

### Production Deployment
```bash
# REQUIRES: /release-audit GO decision
git checkout production
git pull origin production
git merge pre-prod --no-ff -m "Release: Sprint [X] deployment"
git push origin production
```

---

## Pre-Deployment Checklist

- [ ] /release-audit completed with GO decision
- [ ] All tests passing (≥95%)
- [ ] No CRITICAL security issues
- [ ] Environment variables verified
- [ ] Rollback plan confirmed
- [ ] Team notified (production only)

---

## Post-Deployment Validation

1. **Health Check**:
   ```bash
   curl https://[url]/api/health
   # Expected: {"status":"ok"}
   ```

2. **Smoke Tests**:
   - [ ] Login works
   - [ ] Dashboard loads
   - [ ] Core API responds
   - [ ] No console errors

3. **Monitoring**:
   - Watch Render logs for 15 minutes
   - Check error rates

---

## Rollback Procedures

### Quick Rollback (Revert)
```bash
git revert HEAD
git push origin [branch]
```

### Point-in-Time Rollback (Render)
1. Render Dashboard → Service → Deploys
2. Find last working deploy
3. Click "Redeploy"

---

## Related Documentation

- [DEPLOYMENT_CHECKLIST.md](1-DEPLOYMENT/DEPLOYMENT_CHECKLIST.md) - Detailed checklist
- [ENVIRONMENT_COMPARISON.md](1-DEPLOYMENT/ENVIRONMENT_COMPARISON.md) - Environment differences
- [PREPROD_DEPLOYMENT_GUIDE.md](1-DEPLOYMENT/PREPROD_DEPLOYMENT_GUIDE.md) - Pre-prod specifics
- [PRODUCTION_BRANCH_GUIDE.md](1-DEPLOYMENT/PRODUCTION_BRANCH_GUIDE.md) - Production branch management
- [SECRETS_MANAGEMENT.md](1-DEPLOYMENT/SECRETS_MANAGEMENT.md) - Secret handling

---

## Commands

- `/release-audit` - Run before deployment
- `/deploy` - Execute deployment
- `/quick-fix` - Emergency hotfix
