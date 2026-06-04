# Render Deployment Checklist

<!-- @GENOME T2-OPS-006 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/deploy | linked:/release-audit -->

**Date:** October 16, 2025
**Production URL:** https://karvia-business.onrender.com
**Latest Commit:** ea9a099 (Production audit fixes)

---

## ✅ Pre-Deployment (Complete)

- [x] All localhost references removed from code
- [x] Dynamic CORS configuration implemented
- [x] CSP headers production-ready
- [x] IAM Engine included in deployment
- [x] Startup script created (`scripts/start-render.sh`)
- [x] Dockerfile optimized (<2GB memory)
- [x] Production audit completed
- [x] Code pushed to production branch

---

## ⏳ Render Configuration (In Progress)

### Required Environment Variables

Add these in Render Dashboard → Environment:

#### Critical Variables
```bash
NODE_ENV=production
PORT=8080
```

#### Database
```bash
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@[cluster].mongodb.net/karvia_business?retryWrites=true&w=majority
```

#### Authentication Secrets
```bash
# Generate strong random secrets (32+ characters)
JWT_SECRET=[your-jwt-secret-here]
SESSION_SECRET=[your-session-secret-here]
```

#### Email Integration (Mailjet)
```bash
MAILJET_API_KEY=[your-mailjet-api-key]
MAILJET_API_SECRET=[your-mailjet-api-secret]
MAILJET_FROM_EMAIL=rsm@karvia.ai
MAILJET_FROM_NAME=Karvia Business
```

#### Frontend Configuration
```bash
FRONTEND_URL=https://karvia-business.onrender.com
CORS_ORIGIN=https://karvia-business.onrender.com
```

#### Optional (Can use defaults)
```bash
# IAM Engine Internal URL (defaults to localhost:8081)
IAM_ENGINE_URL=http://localhost:8081

# Server host (defaults to 0.0.0.0)
SERVER_HOST=0.0.0.0
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check
- [ ] Visit https://karvia-business.onrender.com/health
- [ ] Verify status is "healthy"
- [ ] Check database connection is working
- [ ] Verify IAM Engine is running

### 2. Authentication Flow
- [ ] Visit https://karvia-business.onrender.com
- [ ] Should redirect to /pages/login.html
- [ ] Create new account (signup)
- [ ] Verify email validation works
- [ ] Login with created credentials
- [ ] Check JWT token is issued

### 3. Assessment Template Creation
- [ ] Login as MANAGER or EXECUTIVE
- [ ] Navigate to Assessment Hub
- [ ] Create new assessment template
- [ ] Add questions from library
- [ ] Save template successfully

### 4. Invitation Flow
- [ ] Create assessment invitation
- [ ] Enter recipient email
- [ ] Set expiration date
- [ ] Send invitation
- [ ] Verify invitation appears in "Sent Invitations"

### 5. Assessment Taking Flow (Full E2E)
- [ ] Logout from manager account
- [ ] Create account with recipient email
- [ ] Login as recipient
- [ ] Navigate to "Assigned to Me"
- [ ] See pending invitation
- [ ] Click "Take Assessment"
- [ ] Complete all questions
- [ ] Submit assessment
- [ ] View results with SSI scores

### 6. Manager Dashboard
- [ ] Login as manager who sent invitation
- [ ] Navigate to dashboard
- [ ] View team member's completed assessment
- [ ] See SSI dimension scores
- [ ] Verify Speed/Strength/Intelligence breakdowns

---

## 🐛 Common Issues & Fixes

### Issue: 503 on Authentication Endpoints
**Cause:** IAM Engine not running
**Check:** Logs should show "🔐 Starting IAM Engine on port 8081"
**Fix:** Verify startup script is executable

### Issue: CORS Errors
**Cause:** CORS_ORIGIN not set
**Check:** Environment variables in Render Dashboard
**Fix:** Add CORS_ORIGIN=https://karvia-business.onrender.com

### Issue: Database Connection Failed
**Cause:** Invalid MONGODB_URI
**Check:** Health endpoint shows database status
**Fix:** Verify MongoDB Atlas connection string

### Issue: Empty req.user.email
**Cause:** JWT token missing email field
**Check:** Server logs for auth middleware
**Fix:** Already implemented - database lookup fallback

### Issue: 404 on Root Path
**Cause:** Missing index.html
**Fix:** Already implemented - redirects to /pages/login.html

---

## 🔍 Monitoring

### Logs to Watch
```bash
# Expected startup logs:
🔐 Starting IAM Engine on port 8081...
🏢 Karvia Business API Server Started
📍 Server: http://0.0.0.0:8080
🔧 Health: http://0.0.0.0:8080/health
🌍 Environment: production
🚀 Ready for OKR management!
```

### Health Metrics
- Server uptime
- Database connection pool
- IAM Engine health
- Memory usage (<2GB)
- Response times

---

## 🎯 Success Criteria

**Deployment is successful when:**
1. ✅ Health endpoint returns "healthy"
2. ✅ Root path redirects to login
3. ✅ Signup/login work without errors
4. ✅ Assessment templates can be created
5. ✅ Invitations can be sent
6. ✅ Recipients can take assessments
7. ✅ Results display correctly
8. ✅ Manager dashboard shows team scores
9. ✅ No CORS errors in browser console
10. ✅ No 404/403/500 errors in normal flow

---

## 📞 Support Contacts

**Issue Tracker:** https://github.com/anthropics/claude-code/issues
**MongoDB Atlas:** https://cloud.mongodb.com
**Mailjet:** https://app.mailjet.com
**Render:** https://dashboard.render.com

---

**Last Updated:** October 16, 2025
**Status:** Awaiting environment variable configuration
