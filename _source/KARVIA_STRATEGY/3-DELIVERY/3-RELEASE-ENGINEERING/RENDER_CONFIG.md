# Render Configuration

<!-- @GENOME T2-OPS-004 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/deploy | linked:/release-audit -->

**Version**: 1.0.0
**Last Updated**: March 30, 2026
**Purpose**: Render deployment configuration and environment variables

---

## Service Configuration

### Development (karvia-business-1)

| Setting | Value |
|---------|-------|
| Service Name | karvia-business-1 |
| Region | Oregon (US West) |
| Branch | development |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Auto-Deploy | Yes |

### Pre-prod (karvia-business-2)

| Setting | Value |
|---------|-------|
| Service Name | karvia-business-2 |
| Region | Oregon (US West) |
| Branch | pre-prod |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Auto-Deploy | Yes |

### Production (karvia-business)

| Setting | Value |
|---------|-------|
| Service Name | karvia-business |
| Region | Oregon (US West) |
| Branch | production |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Auto-Deploy | Yes |

---

## Environment Variables

### Required (All Environments)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | Database connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `[secure-random-string]` |
| `PORT` | Server port | `5000` |

### Optional (Feature Flags)

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | AI features | Disabled if not set |
| `REDIS_URL` | Caching layer | Disabled if not set |
| `SMTP_HOST` | Email notifications | Disabled if not set |
| `SMTP_USER` | Email user | - |
| `SMTP_PASS` | Email password | - |
| `MAILJET_API_KEY` | Mailjet API | - |
| `MAILJET_SECRET` | Mailjet secret | - |

---

## URLs

| Environment | Frontend | API |
|-------------|----------|-----|
| Development | https://karvia-business-1.onrender.com | /api/* |
| Pre-prod | https://karvia-business-2.onrender.com | /api/* |
| Production | https://karvia-business.onrender.com | /api/* |

---

## Health Check Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Basic health check |
| `/` | Frontend loads |

---

## Render Dashboard

- **Dashboard URL**: https://dashboard.render.com
- **Project**: Karvia Business
- **Team**: BRAMHI_LABS

---

## Related Documentation

- [RENDER_PREPROD_ENV_SETUP.md](1-DEPLOYMENT/RENDER_PREPROD_ENV_SETUP.md) - Pre-prod setup details
- [RENDER_ENV_VARS_PREPROD.txt](1-DEPLOYMENT/RENDER_ENV_VARS_PREPROD.txt) - Pre-prod env vars template
- [SECRETS_MANAGEMENT.md](1-DEPLOYMENT/SECRETS_MANAGEMENT.md) - Secret handling
