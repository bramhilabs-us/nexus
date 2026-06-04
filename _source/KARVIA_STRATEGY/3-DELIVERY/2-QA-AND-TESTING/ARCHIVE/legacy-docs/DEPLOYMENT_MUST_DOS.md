# 🚨 DEPLOYMENT MUST-DOS - KARVIA Pro v1.0.0
## Critical Steps for Render Pre-Production

**Created**: November 6, 2025
**Last Deployment**: October 16, 2025 (Production)
**This Deployment**: Pre-Production (v1.0.0)

---

## ⚠️ CRITICAL MUST-DOS (From Last Deployment Experience)

### 1. **Use scripts/start-render.sh NOT npm start** 🔴
**Issue from last time**: IAM Engine didn't start, causing 503 errors on auth endpoints

**FIX**:
```bash
# In Render Dashboard → Settings → Start Command:
./scripts/start-render.sh
```

**Why**: The startup script starts both:
- IAM Engine (port 8081) - handles authentication
- Main Server (port 8080) - handles API

**Verify**: Check logs for:
```
🔐 Starting IAM Engine on port 8081...
🚀 Starting Main Server on port 8080...
```

---

### 2. **Generate NEW JWT Secrets** 🔴
**Issue from last time**: Reusing dev secrets is a security risk

**FIX - Run these commands locally**:
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT_REFRESH_SECRET (different!)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Add to Render Environment Variables** - DO NOT use dev secrets!

---

### 3. **Set FRONTEND_URL and CORS_ORIGIN** 🔴
**Issue from last time**: CORS errors in browser console

**FIX**:
```bash
# Render Environment Variables:
FRONTEND_URL=https://karvia-business-preprod.onrender.com
CORS_ORIGIN=https://karvia-business-preprod.onrender.com
BACKEND_URL=https://karvia-business-preprod.onrender.com
ALLOWED_ORIGINS=https://karvia-business-preprod.onrender.com
```

**Note**: Use your actual Render URL (check Render dashboard for exact URL)

---

### 4. **Create NEW MongoDB Database** 🔴
**Issue from last time**: Don't use production database for pre-prod!

**FIX**:
1. Go to MongoDB Atlas
2. Create new database: `karvia_preprod` (NOT `karvia_business`)
3. Create new user with readWrite permissions
4. Whitelist all IPs: `0.0.0.0/0` (Render has dynamic IPs)
5. Get connection string
6. Add to Render:
```bash
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_preprod?retryWrites=true&w=majority
DB_NAME=karvia_preprod
```

---

### 5. **OpenAI API Key** 🔴
**NEW FEATURE**: AI OKR generation requires OpenAI

**FIX**:
```bash
# Render Environment Variables:
OPENAI_API_KEY=[REDACTED]
FEATURE_OPENAI_ENABLED=true
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2500
OPENAI_TEMPERATURE=0.7
```

**Verify**: Check OpenAI API has credits and is active

---

### 6. **Email Configuration (SMTP)** 🔴
**Issue from last time**: Mailjet was used, but Gmail SMTP is fine for pre-prod

**FIX**:
```bash
# Render Environment Variables:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@karviapro.com
SMTP_PASS=[Gmail App Password]
EMAIL_FROM=noreply@karviapro.com

# Or use Mailjet:
MAILJET_API_KEY=[your-key]
MAILJET_API_SECRET=[your-secret]
MAILJET_FROM_EMAIL=rsm@karvia.ai
MAILJET_FROM_NAME=Karvia Pro
```

---

### 7. **Set NODE_ENV=production** 🔴
**Issue from last time**: Forgot to set production mode

**FIX**:
```bash
# Render Environment Variables:
NODE_ENV=production
PORT=8080
```

**Why**: Enables production optimizations and security

---

### 8. **Make start-render.sh Executable** 🔴
**Issue from last time**: Script had no execute permissions

**FIX - Already done in repo**:
```bash
chmod +x scripts/start-render.sh
```

**Verify**: `ls -la scripts/` shows `-rwxr-xr-x` for start-render.sh

---

## 📋 COMPLETE ENVIRONMENT VARIABLES CHECKLIST

Copy-paste these to Render Dashboard → Environment:

```bash
# === CRITICAL ===
NODE_ENV=production
PORT=8080

# === DATABASE ===
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_preprod?retryWrites=true&w=majority
DB_NAME=karvia_preprod

# === AUTHENTICATION (Generate new secrets!) ===
JWT_SECRET=[generate-with-crypto]
JWT_REFRESH_SECRET=[different-from-jwt-secret]
JWT_EXPIRES_IN=24h
SESSION_SECRET=[generate-with-crypto]

# === OPENAI (NEW - AI OKR Generation) ===
OPENAI_API_KEY=[REDACTED]
FEATURE_OPENAI_ENABLED=true
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2500
OPENAI_TEMPERATURE=0.7

# === EMAIL (Choose Gmail OR Mailjet) ===
# Gmail SMTP:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@karviapro.com
SMTP_PASS=[gmail-app-password]
EMAIL_FROM=noreply@karviapro.com

# OR Mailjet:
# MAILJET_API_KEY=[your-key]
# MAILJET_API_SECRET=[your-secret]
# MAILJET_FROM_EMAIL=rsm@karvia.ai
# MAILJET_FROM_NAME=Karvia Pro

# === FRONTEND/CORS ===
FRONTEND_URL=https://karvia-business-preprod.onrender.com
BACKEND_URL=https://karvia-business-preprod.onrender.com
CORS_ORIGIN=https://karvia-business-preprod.onrender.com
ALLOWED_ORIGINS=https://karvia-business-preprod.onrender.com

# === IAM ENGINE ===
IAM_ENGINE_URL=http://localhost:8081
IAM_SHARED_SECRET=[generate-with-crypto]

# === OPTIONAL ===
SERVER_HOST=0.0.0.0
LOG_LEVEL=info
```

---

## 🚀 RENDER CONFIGURATION STEPS

### Step 1: Create Web Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub: `karvia_business` repo
4. Settings:
   - **Name**: `karvia-business-preprod`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `./scripts/start-render.sh` ⚠️ NOT `npm start`
   - **Instance Type**: Starter ($7/mo) or Free

### Step 2: Add Environment Variables
- Click "Environment" tab
- Add all variables from checklist above
- **Generate NEW secrets** (don't copy from .env)

### Step 3: Deploy
- Click "Create Web Service"
- Monitor build logs
- Wait 5-10 minutes

### Step 4: Verify Deployment
```bash
# Check health endpoint:
curl https://karvia-business-preprod.onrender.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-11-06T...",
  "database": "connected",
  "iam": "running"
}
```

---

## 🧪 POST-DEPLOYMENT TESTING (5-Step Workflow)

**Test these in order**:

### 1. Create Company
- Visit: https://karvia-business-preprod.onrender.com
- Should redirect to login
- Create account (first user auto-becomes Business Owner)
- Verify company created

### 2. Create Team
- Go to Teams → Create Team
- Add team name and function
- Assign manager
- Verify team created

### 3. Create & Send Assessment
- Go to Assessments → Create New
- Select SSI Framework
- Add questions
- Send invitations to team members
- Check email delivery

### 4. Generate AI OKRs ⭐ NEW FEATURE
- Complete assessment as team member
- Login as Executive/Manager
- Go to Team Results → Company Overview
- Review SSI scores and weak areas
- Click "Generate OKRs" button
- **Verify**: 4 objectives created with 16 key results
- **Check logs**: No OpenAI API errors

### 5. View Objectives
- Go to Objectives page
- Verify objectives display correctly
- Test filters (All / At Risk / On Track / AI Generated)
- Check timeline-aware status (may show "At risk" - known issue ISS-S1D8-002)

---

## 🐛 EXPECTED ISSUES (Already Documented)

### ISS-S1D8-002: Timeline Status Shows "At Risk"
- **Impact**: New objectives may show "At risk" instead of "On track"
- **Priority**: P2 (Medium)
- **Workaround**: Ignore for now, will fix in v1.1.0

### ISS-S1D8-003: Target Year Auto-Calculated
- **Impact**: Cannot select custom target year
- **Priority**: P2 (Medium)
- **Workaround**: Defaults to current year + 1

### ISS-S1D8-001: Change Manager Dropdown
- **Impact**: May not show all team members
- **Priority**: P3 (Low)
- **Workaround**: Refresh page

---

## 🔄 ROLLBACK PLAN (If Deployment Fails)

### Option 1: Rollback in Render
1. Go to Render Dashboard
2. Select service: karvia-business-preprod
3. Click "Rollback" to previous deployment
4. Takes ~2 minutes

### Option 2: Git Rollback
```bash
git log --oneline -5  # Find last good commit
git revert [commit-hash]
git push origin main  # Auto-redeploys on Render
```

### Option 3: Database Rollback
1. MongoDB Atlas → Backups
2. Restore from snapshot
3. Update MONGODB_URI in Render if needed

---

## ✅ SUCCESS CRITERIA

**Deployment is successful when**:
1. ✅ Health endpoint returns 200 OK with "database": "connected"
2. ✅ IAM Engine shows in logs: "🔐 Starting IAM Engine on port 8081"
3. ✅ Main server shows: "🚀 Starting Main Server on port 8080"
4. ✅ User can create account and login
5. ✅ Company and team creation works
6. ✅ Assessment creation and invitation works
7. ✅ Email delivery works (check spam folder)
8. ✅ **AI OKR generation works** (NEW - critical!)
9. ✅ Objectives page displays correctly
10. ✅ No CORS errors in browser console
11. ✅ No 500 errors in server logs
12. ✅ MongoDB connections stable (< 50 concurrent)

---

## 📊 MONITORING (First 24 Hours)

### Watch These Metrics in Render Dashboard:
- CPU usage (should be < 50%)
- Memory usage (should be < 500MB)
- Response time (should be < 500ms)
- Error rate (should be < 1%)
- Uptime (should be 100%)

### Check Logs Every 4 Hours:
```bash
# Look for:
✅ "Server started successfully"
✅ "MongoDB connected"
✅ "IAM Engine running"
❌ "ECONNREFUSED" (database connection failed)
❌ "OpenAI API error" (check API key/credits)
❌ "CORS error" (check ALLOWED_ORIGINS)
```

### MongoDB Atlas Monitoring:
- Connections (should be < 50)
- Query performance (should be < 100ms)
- Storage (should grow slowly)

---

## 🎯 WHAT'S DIFFERENT FROM LAST DEPLOYMENT

**October 16, 2025 (Production)**:
- Basic OKR platform
- Assessment engine only
- No AI features

**November 6, 2025 (Pre-Production v1.0.0)**:
- ✅ AI-powered OKR generation (NEW)
- ✅ OpenAI GPT-4o-mini integration (NEW)
- ✅ Objectives dashboard with timeline tracking (NEW)
- ✅ SSI dimension mapping (ENHANCED)
- ✅ Direct MongoDB fetch for objectives (NEW)
- ⚠️ Timeline-aware status (has known issues)

**New Dependencies**:
- OpenAI API (requires API key and credits)
- GPT-4o-mini model
- New environment variables (OPENAI_*)

---

## 📞 EMERGENCY CONTACTS

**If Deployment Fails**:
1. Check Render logs first
2. Verify all environment variables set
3. Test MongoDB connection
4. Check OpenAI API status
5. Review CORS configuration

**Support**:
- Render: https://dashboard.render.com/support
- MongoDB: https://cloud.mongodb.com/support
- OpenAI: https://help.openai.com

---

## 🎉 FINAL PRE-FLIGHT CHECKLIST

Before clicking "Create Web Service":

- [ ] Code pushed to GitHub main branch (commit: 55bf033)
- [ ] MongoDB database `karvia_preprod` created
- [ ] MongoDB user created with readWrite permissions
- [ ] MongoDB IP whitelist set to `0.0.0.0/0`
- [ ] JWT secrets generated (3 different secrets)
- [ ] OpenAI API key verified and has credits
- [ ] SMTP/Mailjet credentials ready
- [ ] All 25+ environment variables prepared
- [ ] Start command set to `./scripts/start-render.sh`
- [ ] Build command set to `npm install`
- [ ] Branch set to `main`
- [ ] Team notified of deployment window
- [ ] Rollback plan reviewed

---

**Ready to Deploy? Follow Render Configuration Steps above!**

**Last Updated**: November 6, 2025
**Commit**: 55bf033
**Status**: ✅ READY FOR DEPLOYMENT

**Estimated Deploy Time**: 10-15 minutes
**Estimated Test Time**: 30 minutes
