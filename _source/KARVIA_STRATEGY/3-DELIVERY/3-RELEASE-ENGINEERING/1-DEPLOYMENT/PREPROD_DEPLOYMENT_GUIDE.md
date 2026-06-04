# PRE-PRODUCTION DEPLOYMENT GUIDE

<!-- @GENOME T2-OPS-007 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/deploy | linked:/release-audit -->

**Sprint**: Sprint 2 - Goal Hierarchy System
**Environment**: Pre-Production (Staging/Testing)
**Platform**: Render.com
**Last Updated**: November 14, 2025

---

## 📋 Overview

This guide walks you through deploying Karvia Business to a **pre-production environment on Render** for testing before production deployment.

**Why Pre-Production?**
- ✅ Test Sprint 2 features in production-like environment
- ✅ Verify database connections and migrations
- ✅ Test authentication flow with production JWT secrets
- ✅ Validate email sending (Mailjet)
- ✅ Monitor OpenAI API usage
- ✅ Catch deployment issues before production

---

## 🎯 Pre-Deployment Checklist

### 1. Code Preparation
- ✅ All Sprint 2 tests passing (10/10)
- ✅ Planning page matches design
- ✅ Navigation enabled for all roles
- ✅ Authentication working locally
- ✅ No console errors in browser
- ✅ Git branch clean and committed

### 2. Environment Files Created
- ✅ `.env.preprod` - Pre-production configuration
- ✅ `.env.production` - Production configuration (for later)
- ✅ `.env` - Development (existing)

### 3. Database Preparation
- ⚠️ **IMPORTANT**: We'll use a separate database `karvia_business_preprod`
- ✅ Same MongoDB cluster as production
- ✅ Isolated from production data
- ✅ Safe for testing

---

## 📦 Step 1: Create New Web Service on Render

### 1.1 Navigate to Render Dashboard
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**

### 1.2 Connect Repository
1. Connect your GitHub/GitLab repository
2. Repository: `karvia_business`
3. Branch: `SPRINT2` (or your current sprint branch)

### 1.3 Configure Service Settings

**Basic Settings:**
```
Name: karvia-business-preprod
Environment: Node
Region: Oregon (US West) or closest to you
Branch: SPRINT2
Root Directory: (leave empty)
```

**Build & Start Commands:**
```
Build Command: npm install
Start Command: npm run start:preprod
```

**Instance Type:**
```
Free (for testing) or Starter ($7/month for better performance)
```

---

## 🔧 Step 2: Configure Environment Variables

In Render dashboard, go to **Environment** tab and add these variables **exactly as shown**:

### Core Configuration
```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=8080
```

### Frontend & CORS (⚠️ UPDATE AFTER DEPLOYMENT)
```bash
# Temporarily use this, then update after getting Render URL
FRONTEND_URL=https://karvia-business-preprod.onrender.com
CORS_ORIGIN=https://karvia-business-preprod.onrender.com
SIGNUP_URL=https://karvia-business-preprod.onrender.com/pages/signup.html
```

### Database
```bash
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false
```

### JWT & Session (Production Secrets)
```bash
JWT_SECRET=[REDACTED]
JWT_EXPIRES_IN=24h
SESSION_SECRET=[REDACTED]
```

### Mailjet Email
```bash
MAILJET_API_KEY=[REDACTED]
MAILJET_API_SECRET=[REDACTED]
MAILJET_FROM_EMAIL=rsm@karvia.ai
MAILJET_FROM_NAME=Karvia Business [PRE-PROD]
```

### OpenAI
```bash
OPENAI_API_KEY=[REDACTED]
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2500
OPENAI_TEMPERATURE=0.7
```

### Feature Flags
```bash
FEATURE_OPENAI_ENABLED=true
FEATURE_EMAIL_ENABLED=true
FEATURE_REDIS_ENABLED=false
FEATURE_IBRAIN_ENABLED=false
ENABLE_AI_FEATURES=true
ENABLE_INTEGRATIONS=false
ENABLE_ANALYTICS=true
```

### Logging
```bash
LOG_LEVEL=info
```

---

## 🔨 Step 3: Update package.json Scripts

Make sure your [package.json](package.json) has this start script:

```json
{
  "scripts": {
    "start": "node server/index.js",
    "start:preprod": "node server/index.js",
    "start:prod": "node server/index.js",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon server/index.js"
  }
}
```

**Note**: The `start:preprod` and `start:prod` both use the same command. Environment is controlled by `NODE_ENV` variable.

---

## 🚀 Step 4: Deploy

1. **Click "Create Web Service"**
2. Render will start building and deploying
3. Watch the logs for any errors
4. Deployment takes 3-5 minutes

**Expected Log Output:**
```
✅ Database connections established
🏢 Karvia Business API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server: http://0.0.0.0:8080
🔧 Health: http://0.0.0.0:8080/health
🌍 Environment: production
🚀 Ready for OKR management!
```

---

## ✅ Step 5: Verify Deployment

### 5.1 Get Your Render URL
After deployment, you'll get a URL like:
```
https://karvia-business-preprod.onrender.com
```

### 5.2 Update Environment Variables
Go back to **Environment** tab and update these three variables with your actual Render URL:

```bash
FRONTEND_URL=https://karvia-business-preprod.onrender.com
CORS_ORIGIN=https://karvia-business-preprod.onrender.com
SIGNUP_URL=https://karvia-business-preprod.onrender.com/pages/signup.html
```

Then click **"Save Changes"** - Render will redeploy automatically.

### 5.3 Test Health Endpoint
Open browser or use curl:
```bash
curl https://karvia-business-preprod.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": {
    "mongodb": {
      "connected": true,
      "database": "karvia_business_preprod"
    }
  },
  "timestamp": "2025-11-14T..."
}
```

---

## 🧪 Step 6: Test Sprint 2 Features

### 6.1 Test Authentication
1. **Open Login Page:**
   ```
   https://karvia-business-preprod.onrender.com/pages/login.html
   ```

2. **Create Test User:**
   - Click "Sign Up"
   - Fill in details:
     - Email: `test@yourcompany.com`
     - Password: `Test1234`
     - Company name: `Test Company`
     - Role: Business Owner

3. **Login:**
   - Use credentials from step 2
   - Should redirect to objectives page

### 6.2 Test Planning Page
1. **Navigate:**
   ```
   https://karvia-business-preprod.onrender.com/pages/planning.html
   ```

2. **Verify Features:**
   - ✅ Quarter selector visible (top right)
   - ✅ Objective tabs load
   - ✅ Can select objectives
   - ✅ KR cards display
   - ✅ "Create Plan" button works
   - ✅ AI plan generation (2-second simulation)
   - ✅ Can create goals

### 6.3 Test Dashboard
1. **Navigate:**
   ```
   https://karvia-business-preprod.onrender.com/pages/sprint2-dashboard.html
   ```

2. **Verify:**
   - ✅ Overview metrics load
   - ✅ Charts display
   - ✅ No console errors

### 6.4 Test API Endpoints

**Test Authentication:**
```bash
curl -X POST https://karvia-business-preprod.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@yourcompany.com","password":"Test1234"}'
```

**Test Planning API (use token from above):**
```bash
curl https://karvia-business-preprod.onrender.com/api/planning/hierarchy?quarter=Q4&year=2025 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Step 7: Monitor & Debug

### 7.1 View Logs
In Render dashboard:
1. Click on your service
2. Go to **"Logs"** tab
3. Monitor for errors

### 7.2 Common Issues & Solutions

**Issue: "CORS Error"**
```
Solution: Verify CORS_ORIGIN matches your Render URL exactly
Check: Environment tab → CORS_ORIGIN variable
```

**Issue: "Database connection failed"**
```
Solution: Check MONGODB_URI is correct
Verify: Database name is karvia_business_preprod
Test: Connection from MongoDB Atlas → Network Access
```

**Issue: "Page loads but API calls fail"**
```
Solution: Check authentication tokens
Verify: JWT_SECRET is set correctly
Test: Login and check browser localStorage for karvia_auth_token
```

**Issue: "Static files not loading"**
```
Solution: Verify server is serving client directory
Check: server/index.js has express.static middleware
```

---

## 📊 Step 8: Performance Testing

### 8.1 Load Testing
Create 5-10 test users and:
- Create objectives
- Set up Key Results
- Create quarterly and weekly goals
- Update progress
- View dashboard

### 8.2 Monitor Metrics
Watch Render dashboard for:
- CPU usage
- Memory usage
- Response times
- Database queries

---

## 🎯 Step 9: Sign-Off Testing

Before moving to production, verify:

| Feature | Status | Notes |
|---------|--------|-------|
| User signup/login | ⬜ | Test with new email |
| Objectives page | ⬜ | Can create/view objectives |
| Planning page | ⬜ | Quarter selector, KR cards, goal creation |
| Dashboard | ⬜ | Metrics load, no errors |
| Email sending | ⬜ | Test assessment invitation |
| Teams page | ⬜ | Can invite team members |
| Navigation | ⬜ | All links work |
| Mobile responsive | ⬜ | Test on phone/tablet |
| Browser compatibility | ⬜ | Test Chrome, Safari, Firefox |
| Performance | ⬜ | Pages load < 3 seconds |

---

## 🚀 Step 10: Production Deployment (After Pre-Prod Success)

Once all pre-prod tests pass:

### 10.1 Create Production Service
1. Repeat Steps 1-2 with:
   - Name: `karvia-business` (production)
   - Branch: `main` or `production`
   - Use `.env.production` values
   - Database: `karvia_business_prod`

### 10.2 Update Production URLs
```bash
FRONTEND_URL=https://karvia-business.onrender.com
CORS_ORIGIN=https://karvia-business.onrender.com
MONGODB_URI=...karvia_business_prod...
```

### 10.3 Deploy & Test
Same testing process as pre-prod

---

## 🔒 Security Checklist

Before production:
- ✅ New JWT secrets generated (different from pre-prod)
- ✅ Database credentials secured
- ✅ API keys rotated if exposed
- ✅ CORS limited to your domain only
- ✅ Rate limiting enabled (future enhancement)
- ✅ SSL/HTTPS enforced (automatic on Render)

---

## 📞 Support & Rollback

### If Issues Occur
1. **Check Render Logs** first
2. **Roll back** to previous deployment (Render → Deploys → Redeploy)
3. **Fix locally** and redeploy
4. **Check MongoDB** Atlas for connection issues

### Rollback Plan
Render keeps previous deployments:
1. Go to **"Deploys"** tab
2. Find last working deploy
3. Click **"Redeploy"**

---

## 📚 Documentation Links

- [Sprint 2 Completion Status](KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT_2/SPRINT_2_COMPLETION_STATUS.md)
- [Local Testing Guide](LOCAL_TESTING_GUIDE.md)
- [Deployment Must-Dos](KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/DEPLOYMENT_MUST_DOS.md)
- [Render Documentation](https://render.com/docs)

---

## ✅ Pre-Prod Deployment Summary

**What You're Deploying:**
- Sprint 2 complete codebase
- Planning page with quarter selector
- Dashboard with analytics
- 11 API endpoints (6 planning + 5 dashboard)
- Enhanced Goal model with hierarchy
- Production-grade authentication

**What to Expect:**
- 3-5 minute deployment time
- Separate pre-prod database
- Production-like environment
- Safe testing before production

**Success Criteria:**
- All 10 API tests passing in pre-prod
- Users can signup, login, create goals
- Planning page works end-to-end
- Dashboard displays metrics
- No console errors or API failures

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Status**: ✅ READY FOR PRE-PROD DEPLOYMENT
