# Karvia Business Deployment Runbook

**Version**: 1.0
**Last Updated**: March 9, 2026
**Author**: Engineering Team

---

## Overview

This runbook documents the deployment process for Karvia Business, a multi-tenant B2B OKR management platform.

### Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Development | `karvia-business-1.onrender.com` | `development` | Feature testing |
| Pre-prod | `karvia-business-2.onrender.com` | `pre-prod` | QA/Staging |
| Production | `karvia-business.onrender.com` | `production` | Live customers |

### Deployment Flow

```
development → pre-prod → production
     ↓            ↓           ↓
  Feature     QA/Staging    Live
  Testing     Validation   Customers
```

---

## Pre-Deployment Checklist

### 1. Code Quality Checks

```bash
# Run pre-deployment script (automated checks)
./scripts/pre-deploy.sh
```

This script verifies:
- [ ] No uncommitted changes
- [ ] All tests pass
- [ ] Test coverage acceptable
- [ ] No exposed secrets in code
- [ ] Required files present

### 2. Manual Verification

- [ ] Code review completed and approved
- [ ] Feature flags configured correctly
- [ ] Database migrations planned (if any)
- [ ] Environment variables updated in Render dashboard
- [ ] No breaking API changes (or clients notified)

### 3. Environment Variables

Required environment variables (verify in Render dashboard):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `NODE_ENV` | Yes | `production` for prod |
| `CORS_ORIGIN` | Yes | Allowed origins for CORS |
| `OPENAI_API_KEY` | No | For AI features (graceful degradation) |
| `REDIS_URL` | No | For caching (graceful degradation) |
| `SMTP_*` | No | For email notifications |

---

## Deployment Process

### Step 1: Merge to Target Branch

```bash
# For development environment
git checkout development
git merge feature/your-feature
git push origin development

# For pre-prod environment
git checkout pre-prod
git merge development
git push origin pre-prod

# For production (CAREFUL!)
git checkout production
git merge pre-prod
git push origin production
```

### Step 2: Monitor Deployment

1. Open Render Dashboard: https://dashboard.render.com
2. Navigate to the appropriate service
3. Watch the deployment logs for errors
4. Verify health check passes: `GET /health`

### Step 3: Post-Deployment Verification

```bash
# Check health endpoint
curl https://karvia-business.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "service": "Karvia Business API Server",
  "version": "1.0.0",
  "environment": "production",
  "uptime": <number>,
  "database": { "overall": true },
  "services": { "overallHealth": "healthy" }
}
```

---

## Rollback Procedure

### Automatic Rollback (Render)

Render automatically keeps previous deployments. To rollback:

1. Go to Render Dashboard → Service → Deploys
2. Find the previous successful deployment
3. Click "Rollback to this deploy"

### Manual Rollback (Git)

```bash
# Revert the last commit
git checkout production
git revert HEAD
git push origin production

# Or reset to specific commit (DESTRUCTIVE)
git checkout production
git reset --hard <commit-hash>
git push origin production --force  # Use with extreme caution!
```

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P1 | Service down | 15 minutes | Database unreachable |
| P2 | Major feature broken | 1 hour | Authentication failing |
| P3 | Minor feature broken | 4 hours | Analytics not loading |
| P4 | Cosmetic issue | Next sprint | UI alignment |

### P1/P2 Incident Procedure

1. **Assess**: Check `/health` endpoint, Render logs, MongoDB status
2. **Communicate**: Notify stakeholders via Slack/email
3. **Mitigate**: Rollback if deployment-related
4. **Resolve**: Fix root cause
5. **Document**: Write post-mortem

### Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Database connection failed | 503 errors, health check fails | Check MONGODB_URI, network rules |
| JWT errors | 401 on all authenticated routes | Verify JWT_SECRET matches |
| CORS errors | Browser blocks requests | Update CORS_ORIGIN in env |
| Memory exceeded | Service restarts frequently | Upgrade Render plan or optimize |

---

## Monitoring

### Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Overall system health |
| `GET /api-docs` | API documentation |

### Key Metrics to Watch

- Response time (target: < 500ms p95)
- Error rate (target: < 1%)
- Memory usage (target: < 80%)
- Database connections (target: < pool max)

### Log Access

```bash
# Render CLI (if installed)
render logs --service karvia-business --tail

# Or use Render Dashboard → Service → Logs
```

---

## Database Operations

### Backup (MongoDB Atlas)

Backups are automatic with MongoDB Atlas. Manual backup:

```bash
# Using mongodump (requires access)
mongodump --uri="$MONGODB_URI" --out=./backup-$(date +%Y%m%d)
```

### Restore

```bash
# Using mongorestore (CAREFUL!)
mongorestore --uri="$MONGODB_URI" --drop ./backup-20260309
```

### Migrations

Currently, migrations are handled manually. Before deploying schema changes:

1. Test migration in development
2. Backup production database
3. Run migration during low-traffic period
4. Verify data integrity

---

## Security Checklist

- [ ] JWT_SECRET is unique and secure (not default)
- [ ] MONGODB_URI uses TLS (`?tls=true`)
- [ ] CORS_ORIGIN is restrictive (not `*`)
- [ ] Rate limiting is enabled
- [ ] Security headers (helmet) configured
- [ ] No secrets in code or logs

---

## Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| Engineering Lead | engineering@karviapro.com | P1/P2 incidents |
| DevOps | devops@karviapro.com | Infrastructure issues |
| Support | support@karviapro.com | Customer-facing issues |

---

## Change Log

| Date | Version | Changes |
|------|---------|---------|
| Mar 9, 2026 | 1.0 | Initial runbook creation |

---

## Quick Reference Commands

```bash
# Pre-deployment checks
./scripts/pre-deploy.sh

# Run tests
npm test

# Check health (development)
curl https://karvia-business-1.onrender.com/health

# Check health (pre-prod)
curl https://karvia-business-2.onrender.com/health

# Check health (production)
curl https://karvia-business.onrender.com/health

# View API docs
open https://karvia-business.onrender.com/api-docs
```
