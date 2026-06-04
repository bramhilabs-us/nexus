# 🌍 ENVIRONMENT COMPARISON

**Purpose**: Compare Development, Pre-Production, and Production environments
**Last Updated**: November 14, 2025

---

## 📊 Environment Comparison Table

| Variable | Development (Local) | Pre-Production (Render) | Production (Render) |
|----------|-------------------|------------------------|-------------------|
| **NODE_ENV** | `development` | `production` | `production` |
| **PORT** | `8080` | `8080` | `8080` |
| **FRONTEND_URL** | `http://localhost:3000` | `https://karvia-business-preprod.onrender.com` | `https://karvia-business.onrender.com` |
| **CORS_ORIGIN** | `http://localhost:8080` | `https://karvia-business-preprod.onrender.com` | `https://karvia-business.onrender.com` |
| **MONGODB_URI** | `...karvia_business_test` | `...karvia_business_preprod` | `...karvia_business_prod` |
| **JWT_SECRET** | Test secret (128 chars) | Production secret (64 chars) | Production secret (64 chars) |
| **MAILJET_FROM_NAME** | `Karvia Business` | `Karvia Business [PRE-PROD]` | `Karvia Business` |
| **LOG_LEVEL** | `debug` | `info` | `info` |
| **OPENAI_API_KEY** | Same across all | Same across all | Same across all |
| **FEATURE_OPENAI_ENABLED** | `true` | `true` | `true` |
| **FEATURE_EMAIL_ENABLED** | `true` | `true` | `true` |

---

## 🗄️ Database Strategy

### Development
- **Database**: `karvia_business_test`
- **Purpose**: Safe local testing and Sprint development
- **Data**: Test users, mock objectives, development goals
- **Cleanup**: Can be reset anytime

### Pre-Production
- **Database**: `karvia_business_preprod`
- **Purpose**: Staging environment for testing before production
- **Data**: Test data that mimics production scenarios
- **Cleanup**: Reset before major releases

### Production
- **Database**: `karvia_business_prod`
- **Purpose**: Live customer data
- **Data**: Real user accounts, objectives, goals, assessments
- **Cleanup**: NEVER reset - production data is sacred

---

## 🔐 Security Differences

| Security Aspect | Development | Pre-Production | Production |
|----------------|-------------|----------------|------------|
| **JWT Secret** | Test (exposed in repo) | Production-grade | Production-grade (rotated) |
| **CORS** | Localhost + wildcard | Specific preprod URL | Specific prod URL only |
| **Error Details** | Full stack traces | Full stack traces | Generic error messages |
| **Logging** | Debug level (verbose) | Info level | Info/Warning only |
| **Rate Limiting** | Disabled | Enabled | Enabled + stricter |
| **SSL/HTTPS** | Not required | Required (Render) | Required (Render) |

---

## 🚀 Deployment Workflow

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│ Development │ ───> │ Pre-Production   │ ───> │ Production  │
│ (Local)     │      │ (Render Staging) │      │ (Render)    │
└─────────────┘      └──────────────────┘      └─────────────┘
      ↓                       ↓                        ↓
   Test DB            Pre-Prod DB               Production DB
 (can reset)         (test data)              (real customers)
```

**Typical Flow:**
1. Develop and test locally with `karvia_business_test` DB
2. Deploy to pre-prod with `karvia_business_preprod` DB
3. Test thoroughly on pre-prod
4. If all tests pass, deploy to production with `karvia_business_prod` DB

---

## 🧪 Testing Strategy by Environment

### Development (Local)
- **Who Tests**: Developers
- **What**: Unit tests, API tests, manual testing
- **Tools**: `npm run dev:server`, localhost
- **Duration**: Continuous during development

### Pre-Production (Render)
- **Who Tests**: Developers, QA, Product Owner
- **What**: Full Sprint 2 feature testing, integration tests
- **Tools**: Render URL, Postman, Browser testing
- **Duration**: 1-2 days before production

### Production (Render)
- **Who Tests**: Limited smoke testing only
- **What**: Critical path verification (login, create goal, view dashboard)
- **Tools**: Monitoring, user feedback
- **Duration**: Ongoing monitoring

---

## 📝 Environment-Specific Features

### Development Only
- ✅ Hot reload (nodemon)
- ✅ Detailed error messages
- ✅ Debug logging
- ✅ Mock data generators
- ✅ Database reset scripts

### Pre-Production Only
- ✅ Email subject line: `[PRE-PROD]` tag
- ✅ Separate test database
- ✅ Production-like environment
- ✅ Full monitoring enabled
- ✅ Performance profiling

### Production Only
- ✅ Real customer data
- ✅ Uptime monitoring
- ✅ Error tracking (Sentry - future)
- ✅ Analytics (future)
- ✅ Backups and disaster recovery

---

## 🔄 Migration Path

### From Dev to Pre-Prod
```bash
# 1. Ensure all tests pass locally
npm run test

# 2. Commit and push to SPRINT2 branch
git add .
git commit -m "Sprint 2 ready for pre-prod"
git push origin SPRINT2

# 3. Deploy to Render pre-prod
# Follow PREPROD_DEPLOYMENT_GUIDE.md

# 4. Run smoke tests on pre-prod URL
# Test authentication, planning, dashboard
```

### From Pre-Prod to Production
```bash
# 1. Verify all pre-prod tests pass
# Check PREPROD_DEPLOYMENT_GUIDE.md Step 9 checklist

# 2. Merge to main/production branch
git checkout main
git merge SPRINT2
git push origin main

# 3. Create production Render service
# Use .env.production values

# 4. Monitor production deployment
# Watch Render logs for errors

# 5. Run production smoke tests
# Limited testing on real production
```

---

## ⚠️ Critical Differences to Remember

### 1. Database Names
```
Development:    karvia_business_test
Pre-Production: karvia_business_preprod
Production:     karvia_business_prod
```

### 2. URLs
```
Development:    http://localhost:8080
Pre-Production: https://karvia-business-preprod.onrender.com
Production:     https://karvia-business.onrender.com
```

### 3. Email Identification
```
Development:    FROM: Karvia Business
Pre-Production: FROM: Karvia Business [PRE-PROD]
Production:     FROM: Karvia Business
```

### 4. JWT Secrets
```
Development:    Test secret (can be in repo)
Pre-Production: Production-grade secret (in Render env only)
Production:     Rotated production secret (in Render env only)
```

---

## 🔍 Monitoring & Debugging

### Development
- **Logs**: Terminal output
- **Debugging**: Chrome DevTools, VS Code debugger
- **Database**: MongoDB Compass, Atlas UI
- **Errors**: Full stack traces in console

### Pre-Production
- **Logs**: Render dashboard → Logs tab
- **Debugging**: Remote debugging, log analysis
- **Database**: MongoDB Atlas (preprod database)
- **Errors**: Structured logging to files

### Production
- **Logs**: Render dashboard (limited access)
- **Debugging**: Error tracking service (future: Sentry)
- **Database**: MongoDB Atlas (read-only for devs)
- **Errors**: User-friendly messages, logged internally

---

## 📊 Data Flow

```
User Action (Browser)
        ↓
    Frontend (Static HTML/JS)
        ↓
    API Request (with JWT token)
        ↓
    Main Server (Port 8080)
        ↓
    ┌─────────────────────────┐
    │  Environment Routing    │
    ├─────────────────────────┤
    │ Dev:     Test DB        │
    │ PreProd: PreProd DB     │
    │ Prod:    Production DB  │
    └─────────────────────────┘
        ↓
    MongoDB Atlas
        ↓
    Response → Frontend → User
```

---

## ✅ Checklist Before Switching Environments

### Before Deploying to Pre-Prod
- [ ] All local tests passing (10/10 API tests)
- [ ] No console errors in browser
- [ ] Navigation works for all roles
- [ ] Planning page matches design
- [ ] Dashboard loads without errors
- [ ] Code committed to SPRINT2 branch
- [ ] `.env.preprod` file created and reviewed

### Before Deploying to Production
- [ ] All pre-prod tests passing
- [ ] Performance acceptable (< 3s page loads)
- [ ] Mobile responsive tested
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Email sending verified
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Rollback plan documented
- [ ] `.env.production` file created and reviewed

---

## 📚 Related Documentation

- [PREPROD_DEPLOYMENT_GUIDE.md](PREPROD_DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) - Local development testing
- [SPRINT_2_COMPLETION_STATUS.md](KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT_2/SPRINT_2_COMPLETION_STATUS.md) - What's being deployed

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Status**: ✅ READY FOR USE
