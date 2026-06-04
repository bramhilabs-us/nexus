# 🧪 LOCAL TESTING GUIDE - Karvia Business Sprint 2

**Last Updated**: November 13, 2025
**Sprint**: Sprint 2 - Goal Hierarchy System
**Environment**: Development (Local)

---

## 📋 Quick Start

### Recommended: Main Server Only (Simplified Setup)

This is the **recommended approach** for Sprint 2 local testing. It eliminates IAM engine complexity and uses only the main server.

```bash
# 1. Start main server only
npm run dev:server

# 2. Access the application
open http://localhost:8080/pages/login.html

# 3. Test credentials
Email: newuser@test.com
Password: Test1234
```

**Why Main Server Only?**
- ✅ Faster startup (no IAM engine needed)
- ✅ Main server handles all auth endpoints correctly
- ✅ No MongoDB connection issues
- ✅ Simpler debugging (one service instead of two)
- ✅ Frontend already configured to use main server

---

## 🏗️ Architecture Overview

### Current Sprint 2 Local Setup

```
┌─────────────────────────────────────────┐
│  Frontend (Static Files)                │
│  Served by Main Server: :8080           │
└──────────────┬──────────────────────────┘
               │
               │ All API requests (including auth)
               ▼
┌─────────────────────────────────────────┐
│  Main Server                             │
│  Port: 8080                              │
│  • Authentication (/api/auth/*)          │
│  • Sprint 2 APIs (/api/planning/*)       │
│  • Dashboard APIs (/api/sprint2-dashboard/*) │
│  • Static file serving                  │
└──────────────┬──────────────────────────┘
               │
               │ MongoDB connection
               ▼
┌─────────────────────────────────────────┐
│  MongoDB Atlas Cloud                     │
│  Database: karvia_business_test          │
│  Collections: users, companies, goals    │
└─────────────────────────────────────────┘
```

### ⚠️ IAM Engine Status (Not Used in Sprint 2)

The IAM Engine (port 8081) has been **disabled for Sprint 2 local testing**:
- Has MongoDB connection buffering issues
- Frontend routing bypasses it (see [client/js/assessment-api-client.js:44-66](client/js/assessment-api-client.js#L44-L66))
- Main server handles all auth instead
- Can be re-enabled later when connection issues are resolved

---

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** v18+ installed
2. **MongoDB** - Using cloud database (no local MongoDB needed)
3. **Environment Variables** - `.env` file configured

### Step 1: Install Dependencies

```bash
cd /Users/sagarrs/Desktop/official_dev/karvia_business
npm install
```

### Step 2: Verify Environment Configuration

Check your [.env](/.env) file has these settings:

```bash
# Database - Uses cloud test database
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_test?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false

# Server
NODE_ENV=development
PORT=8080
HOST=0.0.0.0

# CORS
CORS_ORIGIN=http://localhost:8080

# JWT (Test secrets - DO NOT use in production)
JWT_SECRET=[REDACTED]
JWT_EXPIRES_IN=24h
```

### Step 3: Start Main Server

```bash
npm run dev:server
```

**Expected Output:**
```
✅ Database connections established
🏢 Karvia Business API Server Started
📍 Server: http://0.0.0.0:8080
🔧 Health: http://0.0.0.0:8080/health
🚀 Ready for OKR management!
```

### Step 4: Verify Server Health

```bash
curl http://localhost:8080/health | python3 -m json.tool
```

**Expected:**
```json
{
  "status": "degraded",
  "database": {
    "mongodb": {
      "connected": true,
      "database": "karvia_business_test"
    }
  }
}
```

---

## 🧪 Testing Workflows

### Test 1: Authentication (Main Server)

```bash
cd server/tests
node test-main-server-login.js
```

**Expected Output:**
```
1️⃣  Testing login with existing user...
   ✅ Login successful!
   Token: eyJhbGciOiJIUzI1NiIs...

2️⃣  Testing protected endpoint with token...
   ✅ Protected endpoint accessible!

3️⃣  Testing signup endpoint...
   ✅ Signup successful!
```

### Test 2: Sprint 2 Goal Hierarchy

```bash
cd server/tests
node comprehensive-api-test.js
```

**Tests:**
- ✅ Create quarterly goals
- ✅ Create weekly goals (child of quarterly)
- ✅ Update progress (cascades to parent)
- ✅ Retrieve hierarchy tree
- ✅ Dashboard metrics
- ✅ Weekly performance tracking

### Test 3: Frontend Manual Testing

1. **Open Application:**
   ```bash
   open http://localhost:8080/pages/login.html
   ```

2. **Login:**
   - Email: `newuser@test.com`
   - Password: `Test1234`

3. **Test Sprint 2 Features:**
   - Navigate to Planning page
   - Create quarterly goal (Q4 2025)
   - Create weekly goals under quarterly goal
   - Update weekly goal progress
   - Verify parent quarterly goal progress auto-updates
   - View Dashboard metrics

---

## 📊 API Endpoints Reference

### Authentication (Main Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| GET | `/api/auth/me` | Get current user |

### Sprint 2 Planning APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/planning/goals/quarterly` | Create quarterly goal |
| POST | `/api/planning/goals/weekly` | Create weekly goal (child) |
| GET | `/api/planning/hierarchy` | Get full goal hierarchy |
| GET | `/api/planning/goals/:id/children` | Get child goals |
| PUT | `/api/planning/goals/:id/progress` | Update goal progress |

### Sprint 2 Dashboard APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sprint2-dashboard/overview` | Overall metrics |
| GET | `/api/sprint2-dashboard/hierarchy-tree` | Hierarchy visualization data |
| GET | `/api/sprint2-dashboard/cascade-effectiveness` | Progress cascade analytics |
| GET | `/api/sprint2-dashboard/weekly-performance` | Weekly goal performance |
| GET | `/api/sprint2-dashboard/at-risk-goals` | Goals needing attention |

---

## 🐛 Troubleshooting

### Issue: "Connection refused to localhost:8080"

**Cause**: Server not running or wrong port

**Fix:**
```bash
# Check if server is running
lsof -i :8080

# If nothing running, start server
npm run dev:server
```

### Issue: "MongoDB connection error"

**Cause**: Cloud database not accessible or wrong credentials

**Check:**
```bash
# Verify MONGODB_URI in .env
grep MONGODB_URI .env

# Test connection
mongosh "mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_test"
```

### Issue: "User not found" or "Invalid credentials"

**Cause**: User doesn't exist in test database

**Fix:**
```bash
# Create new user via signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "first_name": "Test",
    "last_name": "User",
    "company_name": "Test Company",
    "industry": "it_services",
    "employee_count": 25,
    "role": "BUSINESS_OWNER"
  }'
```

### Issue: Frontend shows CORS errors

**Cause**: CORS_ORIGIN misconfigured

**Fix in [.env](/.env):**
```bash
CORS_ORIGIN=http://localhost:8080
```

Then restart server:
```bash
# Ctrl+C to stop
npm run dev:server
```

---

## 📁 Important Files

### Configuration
- [.env](/.env) - Environment variables (local development)
- [package.json](/package.json) - npm scripts and dependencies
- [server/index.js](/server/index.js) - Main server entry point

### Sprint 2 Code
- [server/routes/planning.js](/server/routes/planning.js) - Goal hierarchy APIs
- [server/routes/sprint2-dashboard.js](/server/routes/sprint2-dashboard.js) - Dashboard APIs
- [server/models/Goal.js](/server/models/Goal.js) - Goal data model
- [client/pages/planning.html](/client/pages/planning.html) - Planning UI
- [client/pages/sprint2-dashboard.html](/client/pages/sprint2-dashboard.html) - Dashboard UI

### Frontend Configuration
- [client/js/assessment-api-client.js](/client/js/assessment-api-client.js) - API client (IAM routing disabled)

### Testing
- [server/tests/test-main-server-login.js](/server/tests/test-main-server-login.js) - Auth tests
- [server/tests/comprehensive-api-test.js](/server/tests/comprehensive-api-test.js) - Sprint 2 API tests

---

## ⚙️ Advanced: Full Development Mode (Not Recommended for Sprint 2)

If you need to run ALL engines (not just main server):

```bash
# Start all engines + main server + client
npm run dev
```

**Note:** This will attempt to start:
- Main server (8080) ✅
- IAM engine (8081) ⚠️ Has connection issues
- Assessment engine (8082)
- Planner engine (8083)
- And 5 more engines...

**Not recommended** because:
- IAM engine has MongoDB connection issues
- Sprint 2 doesn't need other engines
- Slower startup and more resource usage

---

## 🎯 Current Status vs Production

| Component | Local Status | Production Ready? |
|-----------|-------------|-------------------|
| Main Server Auth | ✅ Working | ✅ Yes |
| Sprint 2 APIs | ✅ Working | ✅ Yes |
| Database Connection | ✅ Cloud Test DB | ⚠️ Need prod DB |
| Frontend Routing | ✅ Uses main server | ✅ Yes |
| IAM Engine | ⚠️ Disabled | ❌ Needs fix |
| JWT Secrets | ✅ Test secrets | ❌ Need new secrets |
| CORS Config | ✅ Localhost | ❌ Need prod URL |

---

## 🚀 Next Steps for Production

Before deploying to production:

1. **Fix or Disable IAM Engine**
   - Option A: Fix MongoDB connection issues
   - Option B: Use main server for auth (current approach)

2. **Generate Production Secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Update Environment Variables**
   - Create separate database: `karvia_preprod`
   - Update CORS_ORIGIN to Render URL
   - Set NODE_ENV=production

4. **Update Start Script**
   - Verify `scripts/start-render.sh` starts correct services
   - Test locally before deploying

See [DEPLOYMENT_MUST_DOS.md](/KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/DEPLOYMENT_MUST_DOS.md) for full deployment checklist.

---

## 📞 Support

**Issues?**
- Check [Troubleshooting](#-troubleshooting) section above
- Review server logs in terminal
- Test API endpoints with curl or Postman

**Documentation:**
- [Sprint 2 Planning Doc](/KARVIA_STRATEGY/1-PLANNING/SPRINTS/SPRINT-02/sprint-2-plan.md)
- [Deployment Checklist](/KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/PRE_DEPLOY_CHECKLIST.md)

---

**Last Tested**: November 13, 2025
**Test Results**: ✅ All Sprint 2 features working
**Blockers**: None for local testing
