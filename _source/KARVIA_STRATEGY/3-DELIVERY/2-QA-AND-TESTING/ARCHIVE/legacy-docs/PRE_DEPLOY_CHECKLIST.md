# 🚀 PRE-DEPLOYMENT CHECKLIST - KARVIA Pro v1.0.0
## Render Pre-Production Deployment

**Date**: November 6, 2025
**Target Environment**: Render (Pre-Production)
**Version**: 1.0.0

---

## ✅ CODE READINESS

### 1. Modified Files Ready for Commit
- [x] `.gitignore` - Added documentation exclusions
- [x] `RELEASE_NOTES_v1.0.0.md` - Created comprehensive release notes
- [x] `Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md` - Updated with issues ISS-S1D8-002 and ISS-S1D8-003
- [x] `PRE_DEPLOY_CHECKLIST.md` - This file

### 2. Code Quality Verification

**✅ PASSED: Frontend API Calls**
- All API calls use relative URLs (e.g., `/api/auth/login`)
- Auto-detection logic in `client/js/assessment-api-client.js` handles localhost vs production
- No hardcoded localhost URLs in production flow

**✅ PASSED: Package.json**
```json
"scripts": {
  "start": "node server/index.js"
}
```
Correct entry point for Render deployment.

**✅ PASSED: Environment Detection**
Frontend automatically detects:
- `localhost` → `http://localhost:8080`
- `app.karvia.com` → `https://api.karvia.com`
- Other domains → Uses `window.location.origin`

**⚠️ TO VERIFY: CORS Configuration**
Server uses config-based CORS (from `server/index.js`):
```javascript
app.use(cors(config.get('security.cors')));
```
Must verify config includes Render domain.

---

## 🔧 RENDER CONFIGURATION

### Build Settings
```bash
Build Command:    npm install
Start Command:    npm start
Node Version:     18.x
Auto-Deploy:      Yes (main branch)
Health Check:     /api/health
```

### Required Environment Variables

#### Critical - Must Set Before Deploy ⚠️

```bash
# Database
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@[cluster].mongodb.net/karvia_preprod?retryWrites=true&w=majority
DB_NAME=karvia_preprod

# Authentication (Generate new secrets!)
JWT_SECRET=[use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"]
JWT_REFRESH_SECRET=[different from JWT_SECRET]
SESSION_SECRET=[another unique secret]

# OpenAI (for AI OKR generation)
OPENAI_API_KEY=[REDACTED]
FEATURE_OPENAI_ENABLED=true

# Email (Gmail SMTP example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@karviapro.com
SMTP_PASS=[Gmail App Password]
EMAIL_FROM=noreply@karviapro.com

# Application
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://karvia-business-preprod.onrender.com
BACKEND_URL=https://karvia-business-preprod.onrender.com
ALLOWED_ORIGINS=https://karvia-business-preprod.onrender.com

# IAM Engine (if using separate service)
IAM_ENGINE_URL=http://localhost:3002
IAM_SHARED_SECRET=[unique-secret]

# Logging
LOG_LEVEL=info
```

#### Optional - Can Set Later
```bash
# Feature Flags
FEATURE_GOAL_MANAGEMENT=false
FEATURE_BULK_INVITATIONS=false

# Performance
REQUEST_TIMEOUT=30000
MAX_UPLOAD_SIZE=10mb
```

---

## 🗄️ DATABASE PREPARATION

### MongoDB Atlas Setup
- [ ] Create new database: `karvia_preprod`
- [ ] Create database user with readWrite role
- [ ] Whitelist Render IP ranges:
  - Go to Network Access → Add IP Address
  - Add: `0.0.0.0/0` (allows all IPs - Render has dynamic IPs)
  - Alternative: Use specific Render region IPs
- [ ] Test connection locally:
  ```bash
  mongosh "mongodb+srv://[connection-string]"
  ```
- [ ] Verify collections exist (will be auto-created on first use):
  - `companies`
  - `users`
  - `teams`
  - `assessments`
  - `objectives`
  - `keyresults`

### Database Migration (if needed)
- [ ] Run any pending migrations
- [ ] Seed initial data (if required)

---

## 📁 FILES TO EXCLUDE FROM DEPLOYMENT

**Already in .gitignore** ✅
```
/Karvia_OKR_Mockups/
/Karvia_OKR_Product_Planning/
/KARVIA_STRATEGY/
.env
.env.*
node_modules/
logs/
*.log
```

These files stay in your local repo but won't be pushed to Render.

---

## 🧪 POST-DEPLOYMENT TESTING PLAN

### 1. Health Check
```bash
curl https://karvia-business-preprod.onrender.com/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

### 2. Critical User Flow (5-Step Workflow)

**Test 1: User Registration via Invitation**
- [ ] Access invitation link
- [ ] Complete registration form
- [ ] Verify JWT token received
- [ ] Verify redirect to dashboard

**Test 2: Create Company & Team**
- [ ] Login as business owner
- [ ] Create company (name, industry, size)
- [ ] Create team (name, function)
- [ ] Add team manager

**Test 3: Create & Send Assessment**
- [ ] Go to Assessments → Create New
- [ ] Select SSI Framework
- [ ] Add questions
- [ ] Send invitations to team
- [ ] Verify email delivery

**Test 4: Complete Assessment & View Results**
- [ ] Login as team member
- [ ] Complete assessment
- [ ] Submit responses
- [ ] Login as executive/manager
- [ ] View Company Overview with SSI scores

**Test 5: Generate AI OKRs**
- [ ] Go to Team Results → Company Overview
- [ ] Review SSI dimension scores and weak areas
- [ ] Click "Generate OKRs" button
- [ ] Verify OpenAI API call succeeds
- [ ] Verify 4 objectives created with 16 KRs
- [ ] Check objectives saved to MongoDB

**Test 6: View Objectives**
- [ ] Go to Objectives page
- [ ] Verify objectives display with correct status
- [ ] Test filtering (All / At Risk / On Track / AI Generated)
- [ ] Verify progress bars and week tracking

### 3. Frontend Asset Loading
- [ ] CSS files load (no 404s)
- [ ] JavaScript files load
- [ ] Images display correctly
- [ ] No console errors

### 4. CORS & Authentication
- [ ] API calls from frontend succeed
- [ ] No CORS errors in browser console
- [ ] JWT refresh works on token expiry
- [ ] Protected routes require authentication

---

## 🐛 KNOWN ISSUES TO MONITOR

### ISS-S1D8-002: Timeline Status Shows "At Risk"
**Impact**: New objectives may incorrectly show "At risk" status
**Workaround**: Manual verification of timeline vs progress
**Priority**: P2 (Medium)
**Fix Timeline**: 2-3 hours

### ISS-S1D8-003: Target Year Auto-Calculated
**Impact**: Users cannot select custom target year
**Workaround**: Objectives default to current year + 1
**Priority**: P2 (Medium)
**Fix Timeline**: 3-4 hours

### ISS-S1D8-001: Change Manager Dropdown
**Impact**: May not show all team members
**Workaround**: Refresh page or re-select team
**Priority**: P3 (Low)
**Fix Timeline**: 1-2 hours

---

## 🔄 ROLLBACK PLAN

If critical issues occur post-deployment:

### Immediate Rollback (< 5 minutes)
1. Go to Render Dashboard
2. Select service: karvia-business-preprod
3. Click "Rollback" to previous deployment
4. Verify service is running
5. Test health endpoint

### Database Rollback (if needed)
1. Go to MongoDB Atlas
2. Select cluster → Backups
3. Restore from last automated backup
4. Update connection string if needed

### Git Rollback (if needed)
```bash
git log --oneline -10  # Find last good commit
git revert [commit-hash]
git push origin main  # Triggers auto-redeploy
```

---

## 📊 MONITORING CHECKLIST

### Render Dashboard Metrics
- [ ] CPU usage < 80%
- [ ] Memory usage < 80%
- [ ] No crash loops
- [ ] Build time < 5 minutes
- [ ] Response time < 500ms

### Application Logs
```bash
# Check Render logs for errors
- Look for: "Server started on port 8080"
- Look for: "MongoDB connected successfully"
- Look for: OpenAI API errors
- Look for: CORS errors
- Look for: Authentication errors
```

### Database Monitoring
- [ ] MongoDB Atlas metrics: connections < 500
- [ ] Query performance < 100ms
- [ ] No connection pool exhaustion

---

## 🚨 EMERGENCY CONTACTS

**Technical Issues**
- Technical Lead: [Name] - [Email/Phone]
- DevOps: Render Support (support@render.com)

**Business Issues**
- Product Owner: [Name] - [Email/Phone]
- Stakeholder: [Name] - [Email/Phone]

**Third-Party Services**
- MongoDB Atlas: support@mongodb.com
- OpenAI: help.openai.com
- Gmail SMTP: Google Workspace Support

---

## 📝 DEPLOYMENT STEPS (Day of Release)

### Step 1: Prepare Code
```bash
cd /Users/sagarrs/Desktop/official_dev/karvia_business
git status  # Verify clean state
git log --oneline -5  # Review recent commits
```

### Step 2: Commit Changes
```bash
git add .gitignore
git add RELEASE_NOTES_v1.0.0.md
git add PRE_DEPLOY_CHECKLIST.md
git add Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md
git commit -m "chore: prepare v1.0.0 for pre-production deployment

- Add documentation exclusions to .gitignore
- Create comprehensive release notes
- Document known issues (ISS-S1D8-002, ISS-S1D8-003)
- Add pre-deployment checklist

Excludes from deployment:
- /Karvia_OKR_Mockups/
- /Karvia_OKR_Product_Planning/
- /KARVIA_STRATEGY/

Ready for Render deployment."
```

### Step 3: Push to GitHub
```bash
git push origin main
```

### Step 4: Create Render Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `karvia_business`
4. Configure:
   - **Name**: karvia-business-preprod
   - **Region**: Oregon (US West) or closest to users
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Starter ($7/month) or Free (for testing)

### Step 5: Add Environment Variables
Copy all variables from "Required Environment Variables" section above.

**Generate Secrets:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT Refresh Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Session Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 6: Deploy
1. Click "Create Web Service"
2. Monitor build logs in real-time
3. Wait for "Deploy successful" message
4. Note the URL: `https://karvia-business-preprod.onrender.com`

### Step 7: Post-Deploy Testing
Run through all tests in "POST-DEPLOYMENT TESTING PLAN" section above.

### Step 8: Monitor for 24 Hours
- Check Render logs every 4 hours
- Monitor MongoDB Atlas connections
- Watch for error spikes
- Verify OpenAI API usage stays within quota

---

## ✅ FINAL PRE-FLIGHT CHECKS

Before clicking "Deploy" on Render:

- [ ] `.gitignore` updated and committed
- [ ] All secrets generated (JWT, Session, IAM)
- [ ] MongoDB Atlas database created and accessible
- [ ] SMTP credentials tested (send test email)
- [ ] OpenAI API key valid and has credits
- [ ] Render environment variables set (all 20+ variables)
- [ ] Health check endpoint tested locally: `/api/health`
- [ ] Start command verified: `npm start` → `node server/index.js`
- [ ] No hardcoded localhost URLs in production paths
- [ ] CORS config includes Render domain
- [ ] Team notified of deployment window
- [ ] Rollback plan reviewed and understood

---

## 📈 SUCCESS CRITERIA

**Deployment is successful when:**
1. ✅ Health check returns 200 OK
2. ✅ User can register via invitation
3. ✅ User can login and receive JWT token
4. ✅ Company and team creation works
5. ✅ Assessment creation and invitation works
6. ✅ Email invitations deliver successfully
7. ✅ SSI results display correctly
8. ✅ AI OKR generation succeeds (OpenAI integration)
9. ✅ Objectives page displays with correct UI
10. ✅ No CORS errors in browser console
11. ✅ No 500 errors in server logs
12. ✅ MongoDB connections stable

**Metrics to track:**
- Response time: < 500ms (p95)
- Error rate: < 1%
- Uptime: > 99%
- Database connections: < 50 concurrent

---

## 🎉 POST-DEPLOYMENT

### Immediate (Day 1)
- [ ] Send success notification to team
- [ ] Update status page (if applicable)
- [ ] Share deployment URL with stakeholders
- [ ] Monitor logs for first 4 hours

### Short-term (Week 1)
- [ ] Gather user feedback
- [ ] Fix critical bugs (P0)
- [ ] Document any new issues in MASTER_ISSUES_LIST.md
- [ ] Plan v1.1.0 features

### Long-term (Month 1)
- [ ] Analyze usage metrics
- [ ] Plan performance optimizations
- [ ] Address known issues (ISS-S1D8-002, ISS-S1D8-003)
- [ ] Implement missing features (Goal Management frontend)

---

**Last Updated**: November 6, 2025
**Prepared By**: Claude AI Assistant
**Status**: ✅ READY FOR DEPLOYMENT
