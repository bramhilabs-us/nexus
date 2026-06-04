# ✅ PRE-PROD DEPLOYMENT CHECKLIST

**Quick reference for deploying to Render pre-production**
**Estimated Time**: 15-20 minutes
**Last Updated**: November 14, 2025

---

## 🎯 STEP-BY-STEP CHECKLIST

### □ STEP 1: Pre-Deployment Verification (5 min)
- [ ] All Sprint 2 tests passing locally
  ```bash
  node server/tests/comprehensive-api-test.js
  ```
- [ ] Server starts without errors
  ```bash
  npm run dev:server
  ```
- [ ] Planning page loads at `http://localhost:8080/pages/planning.html`
- [ ] Can login with `newuser@test.com` / `Test1234`
- [ ] No console errors in browser DevTools

### □ STEP 2: Code Preparation (2 min)
- [ ] Code committed to Git
  ```bash
  git status  # Should be clean
  git log -1  # Verify last commit
  ```
- [ ] Branch pushed to GitHub
  ```bash
  git push origin SPRINT2
  ```
- [ ] Files ready:
  - `.env.preprod` ✅
  - `RENDER_ENV_VARS_PREPROD.txt` ✅
  - `PREPROD_DEPLOYMENT_GUIDE.md` ✅

### □ STEP 3: Create Render Service (3 min)
- [ ] Go to https://dashboard.render.com
- [ ] Click **"New +" → "Web Service"**
- [ ] Connect repository: `karvia_business`
- [ ] Configure:
  - **Name**: `karvia-business-preprod`
  - **Environment**: `Node`
  - **Branch**: `SPRINT2`
  - **Build Command**: `npm install`
  - **Start Command**: `npm run start:preprod`
  - **Instance**: Free or Starter ($7/month)

### □ STEP 4: Add Environment Variables (5 min)
- [ ] Open `RENDER_ENV_VARS_PREPROD.txt`
- [ ] Copy all variables to Render **Environment** tab
- [ ] **CRITICAL**: Paste exactly as shown (26 variables total)
- [ ] Verify these are set:
  - `NODE_ENV=production` ✅
  - `MONGODB_URI` (with `karvia_business_preprod`) ✅
  - `JWT_SECRET` (production secret) ✅
  - `FEATURE_OPENAI_ENABLED=true` ✅

### □ STEP 5: Deploy (3 min)
- [ ] Click **"Create Web Service"**
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Watch logs for success message:
  ```
  ✅ Database connections established
  🏢 Karvia Business API Server Started
  🚀 Ready for OKR management!
  ```

### □ STEP 6: Get Render URL & Update (2 min)
- [ ] Copy your Render URL: `https://karvia-business-preprod-XXXXX.onrender.com`
- [ ] Go to **Environment** tab
- [ ] Update these 3 variables with your URL:
  - `FRONTEND_URL`
  - `CORS_ORIGIN`
  - `SIGNUP_URL`
- [ ] Click **"Save Changes"** (triggers redeploy)

### □ STEP 7: Verify Health (1 min)
- [ ] Open in browser: `https://your-url.onrender.com/health`
- [ ] Should see:
  ```json
  {
    "status": "healthy",
    "database": {
      "mongodb": {
        "connected": true,
        "database": "karvia_business_preprod"
      }
    }
  }
  ```

### □ STEP 8: Seed Pre-Prod Database (2 min)
- [ ] Seed assessment questions and templates:
  ```bash
  MONGODB_URI="mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority" node server/scripts/seed-preprod.js
  ```
- [ ] Verify output shows:
  - ✅ 146 questions seeded
  - ✅ Template created
  - ✅ No errors

### □ STEP 9: Test Authentication (3 min)
- [ ] Open: `https://your-url.onrender.com/pages/login.html`
- [ ] Click **"Sign Up"**
- [ ] Create test account:
  - Email: `test@yourcompany.com`
  - Password: `Test1234`
  - Company: `Test Company`
- [ ] Login successful → Redirects to Objectives page

### □ STEP 10: Test Planning Page (5 min)
- [ ] Navigate to Planning page (click in nav)
- [ ] Verify:
  - [ ] Quarter selector visible (top right)
  - [ ] Objective tabs display
  - [ ] Can click objective tabs
  - [ ] KR cards show on left
  - [ ] Can click "Create Plan" button
  - [ ] Planning panel opens on right
  - [ ] Can fill timeline and owner
  - [ ] Click "Generate AI Plan" works (2-sec loading)
  - [ ] Weekly goals display
  - [ ] Click "Create Goals" succeeds
  - [ ] Success message appears

### □ STEP 11: Test Dashboard (2 min)
- [ ] Navigate to Dashboard page
- [ ] Verify:
  - [ ] Overview metrics display
  - [ ] No console errors
  - [ ] Charts/data loads

### □ STEP 12: Test API Endpoints (3 min)
Using curl or Postman:

```bash
# 1. Test login
curl -X POST https://your-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@yourcompany.com","password":"Test1234"}'

# 2. Copy token from response, then test planning API
curl https://your-url.onrender.com/api/planning/hierarchy?quarter=Q4&year=2025 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

- [ ] Login returns token ✅
- [ ] Planning API returns data ✅

### □ STEP 13: Sign-Off Testing (10 min)

| Feature | Works? | Notes |
|---------|--------|-------|
| User signup | □ |  |
| User login | □ |  |
| Objectives page | □ |  |
| Planning page | □ |  |
| - Quarter selector | □ |  |
| - Objective tabs | □ |  |
| - KR cards | □ |  |
| - Create plan workflow | □ |  |
| - AI generation | □ |  |
| - Create goals | □ |  |
| Dashboard page | □ |  |
| Teams page | □ |  |
| Navigation links | □ |  |
| Mobile responsive | □ | Test on phone |
| No console errors | □ | Check DevTools |

### □ STEP 14: Performance Check (2 min)
- [ ] Login page loads < 2 seconds
- [ ] Planning page loads < 3 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] No 500 errors in Render logs

---

## 🚨 TROUBLESHOOTING

### Issue: CORS Error
```
Error: Access to fetch has been blocked by CORS policy
```
**Fix**: Verify `CORS_ORIGIN` matches your Render URL exactly
1. Go to Render → Environment
2. Check `CORS_ORIGIN` value
3. Should be: `https://karvia-business-preprod-XXXXX.onrender.com`
4. Save and redeploy

### Issue: Database Connection Failed
```
Error: MongoServerError: bad auth
```
**Fix**: Check MongoDB URI
1. Verify `MONGODB_URI` in Render Environment
2. Database name should be: `karvia_business_preprod`
3. Check MongoDB Atlas → Network Access allows Render

### Issue: 401 Unauthorized
```
Error: Unauthorized access
```
**Fix**: Check JWT secret
1. Verify `JWT_SECRET` is set in Render
2. Try logging in again to get fresh token
3. Check browser localStorage for `karvia_auth_token`

### Issue: Static Files 404
```
Error: GET /pages/login.html 404
```
**Fix**: Verify server is serving client directory
1. Check `server/index.js` has:
   ```javascript
   app.use(express.static('client'));
   ```
2. Redeploy if needed

---

## ✅ SUCCESS CRITERIA

All boxes checked above = **READY FOR PRODUCTION**

If any tests fail:
1. Check Render logs for errors
2. Fix locally
3. Push to GitHub
4. Render auto-deploys
5. Re-test

---

## 📞 NEXT STEPS AFTER SUCCESS

1. **Document Pre-Prod URL**: Save URL for team testing
2. **Share with Team**: Let QA/Product test
3. **Monitor for 24-48 hours**: Watch for issues
4. **Production Deployment**: Follow same steps with production config

---

## 📊 DEPLOYMENT STATUS

Date: _______________
Time Started: _______________
Time Completed: _______________
Pre-Prod URL: _______________
Status: □ Success  □ Failed (reason: _______________)
Deployed By: _______________

---

**Print this checklist and check boxes as you go!**
