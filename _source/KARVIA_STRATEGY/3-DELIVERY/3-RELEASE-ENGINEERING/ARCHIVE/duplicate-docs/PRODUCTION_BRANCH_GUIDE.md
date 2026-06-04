# Production Branch Deployment Guide

**Created**: October 15, 2025
**Branch**: `production`
**Purpose**: Clean deployment branch for Render and customer demos

---

## 🎯 Overview

The `production` branch is a clean, customer-facing version of the codebase without internal planning documents. This branch is specifically designed for:

- **Render deployment**
- **Customer demos**
- **Third-party hosting**
- **External collaborators**

---

## 📊 What's Different?

### Production Branch (Clean)
```
karvia_business/
├── client/          ✅ Frontend code
├── server/          ✅ Backend code
├── engines/         ✅ Microservices
├── scripts/         ✅ Deployment scripts
├── tests/           ✅ Test files
├── package.json     ✅ Dependencies
├── README.md        ✅ Updated with branch note
└── .env.example     ✅ Template (no secrets)
```

### Main Branch (Full Development)
```
karvia_business/
├── All above files
├── KARVIA_STRATEGY/              ❌ Removed from production
├── Karvia_OKR_Product_Planning/  ❌ Removed from production
└── Karvia_OKR_Mockups/           ❌ Removed from production
```

**Total Reduction**: ~4MB+, 399 files removed from production

---

## 🚀 Deployment to Render

### Step 1: Connect Repository

1. Log in to [Render](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `myrhydm/karvia-business`
4. Select branch: **`production`** ← Important!

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `karvia-business` (or your preferred name)
- **Branch**: `production`
- **Region**: Choose closest to your users
- **Instance Type**: Start with Free tier, upgrade as needed

**Build & Deploy:**
```yaml
# Build Command
npm install

# Start Command
node server/index.js

# Environment
Node Version: 18.x
```

### Step 3: Environment Variables

**Critical**: Add these in Render Dashboard → Environment → Environment Variables

```bash
# Application
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-app.onrender.com

# Database
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster.mongodb.net/karvia_business

# JWT Authentication (Generate new strong secrets!)
JWT_SECRET=<generate-64-char-random-string>
JWT_EXPIRES_IN=24h
SESSION_SECRET=<generate-64-char-random-string>

# OpenAI Integration
OPENAI_API_KEY=[REDACTED]
OPENAI_MODEL=gpt-4o-mini

# Email (Mailjet)
MAILJET_API_KEY=<your-mailjet-key>
MAILJET_API_SECRET=<your-mailjet-secret>
MAILJET_FROM_EMAIL=noreply@karvia.com
MAILJET_FROM_NAME=Karvia Business

# Redis (Optional - for caching)
REDIS_URL=redis://red-xxx.onrender.com:6379

# Microservice Engine URLs (Optional - if deploying separately)
IAM_ENGINE_URL=http://localhost:8081
ASSESSMENT_ENGINE_URL=http://localhost:8082
PLANNER_ENGINE_URL=http://localhost:8083
SCORING_ENGINE_URL=http://localhost:8084
OBSERVER_ENGINE_URL=http://localhost:8085
TRACKING_ENGINE_URL=http://localhost:8086

# CORS
CORS_ORIGIN=https://your-app.onrender.com

# Logging
LOG_LEVEL=info
```

### Step 4: Generate Strong Secrets

**IMPORTANT**: Never use the secrets from `.env` in production!

```bash
# On your local machine, generate new secrets:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Run this 3 times to generate:
# 1. JWT_SECRET
# 2. SESSION_SECRET
# 3. Any other secret needed
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone the `production` branch
   - Run `npm install`
   - Start the server with `node server/index.js`
3. Wait for build to complete (~5-10 minutes)
4. Access your app at: `https://your-app.onrender.com`

---

## ⚠️ Important Security Notes

### Before Deploying:

1. **Never commit secrets** to the repository
2. **Use Render environment variables** for all secrets
3. **Generate new secrets** for production (don't reuse development secrets)
4. **Enable HTTPS** (Render does this automatically)
5. **Set strong JWT secrets** (64+ characters, random)

### After Deploying:

1. Test the deployed application
2. Verify environment variables are set correctly
3. Check logs for any errors
4. Test with a real user flow (signup → assessment → results)

---

## 🔄 Updating Production

### Workflow:

```bash
# 1. Work on main branch (with planning docs)
git checkout main
# Make changes, commit

# 2. Merge code changes to production
git checkout production
git merge main --no-commit

# 3. Ensure planning docs are still removed
git status  # Should show no planning/mockup/strategy files

# 4. If any planning files appear, remove them
git rm -r KARVIA_STRATEGY Karvia_OKR_Product_Planning Karvia_OKR_Mockups

# 5. Commit and push
git commit -m "Update production from main"
git push origin production

# 6. Render auto-deploys from production branch
```

### Automatic Deployment:

Render will automatically redeploy when you push to the `production` branch.

---

## 🧪 Testing Before Production

### Local Testing of Production Branch:

```bash
# Switch to production branch
git checkout production

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your local credentials
nano .env

# Start the server
node server/index.js

# Test at http://localhost:8080
```

### Verify Checklist:

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Login/signup working
- [ ] Assessment flow working
- [ ] Email sending working (if configured)
- [ ] No planning docs visible in file structure

---

## 📈 Monitoring Production

### Render Dashboard:

- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, request counts
- **Events**: Deployment history
- **Health**: Service uptime

### Health Check Endpoints:

Once Week 2 is complete, these will be available:

```
GET /health              - Basic health check
GET /health/liveness     - Is app running?
GET /health/readiness    - Can serve traffic?
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check Render logs
- Verify `package.json` has all dependencies
- Ensure Node version is 18.x+

**2. App Crashes on Start**
- Check environment variables are set
- Verify MongoDB URI is correct
- Check logs for specific error

**3. Database Connection Fails**
- Verify MongoDB URI in environment variables
- Check MongoDB Atlas allows Render IPs (0.0.0.0/0)
- Test connection string locally first

**4. Secrets Exposed**
- NEVER commit `.env` to git
- Use Render environment variables only
- Rotate any exposed secrets immediately

---

## 📚 Branch Maintenance

### Main Branch (Development)
- Contains all planning documents
- Full development context
- Internal use only
- All feature development happens here

### Production Branch (Deployment)
- Code only, no planning docs
- Customer-facing
- Clean for external hosting
- Merged from main periodically

### Sync Strategy:

```bash
# Weekly sync (or after major features)
git checkout production
git merge main --no-commit
git rm -r KARVIA_STRATEGY Karvia_OKR_Product_Planning Karvia_OKR_Mockups
git commit -m "Sync from main - Week X updates"
git push origin production
```

---

## 🔐 Security Checklist

Before going live:

- [ ] All secrets in Render environment variables
- [ ] No secrets in git history (production branch clean)
- [ ] Strong JWT secrets (64+ characters)
- [ ] HTTPS enabled (Render default)
- [ ] CORS configured for your domain only
- [ ] Rate limiting enabled (Week 2 task)
- [ ] Error handling complete (Week 2 task)
- [ ] Input validation on all endpoints (Week 2 task)
- [ ] Health checks working (Week 2 task)
- [ ] Logging configured (Week 2 task)

---

## 📊 Repository Structure

### GitHub Repository:
```
myrhydm/karvia-business
├── main branch          (development + planning)
└── production branch    (clean code only)
```

### URLs:
- **Repository**: https://github.com/myrhydm/karvia-business
- **Production Branch**: https://github.com/myrhydm/karvia-business/tree/production
- **Render App**: https://your-app.onrender.com (after deployment)

---

## 🎯 Next Steps

1. ✅ **Production branch created and pushed**
2. ⬜ Complete Week 2 production hardening (security, logging, monitoring)
3. ⬜ Deploy to Render with environment variables
4. ⬜ Test deployed application
5. ⬜ Share with customers for demos
6. ⬜ Monitor and iterate

---

## 📞 Support

For issues:
1. Check Render logs first
2. Review this guide
3. Test locally with production branch
4. Check environment variables configuration

---

**Document Version**: 1.0
**Last Updated**: October 15, 2025
**Branch**: `production`
**Status**: ✅ Ready for deployment (after Week 2 hardening)
