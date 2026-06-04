# Render Pre-Production Environment Setup

## Critical Environment Variables for Preprod

### Required Environment Variables in Render Dashboard

Go to: https://dashboard.render.com → karvia-business-1 → Environment

**Set these EXACT values:**

```bash
# Database - PREPROD DATABASE
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority

# Node Environment
NODE_ENV=production

# Server Configuration
PORT=8080
HOST=0.0.0.0

# JWT Secret (same as prod for testing)
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Feature Flags
FEATURE_OPENAI_ENABLED=true
FEATURE_EMAIL_ENABLED=true
FEATURE_REDIS_ENABLED=false
FEATURE_IBRAIN_ENABLED=false

# OpenAI (if enabled)
OPENAI_API_KEY=[REDACTED]

# Email (if enabled)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM=your_email@gmail.com

# Render Deployment
RENDER=true
```

## Verification Steps

### 1. Check Environment Variables

After setting env vars in Render dashboard:
1. Click "Save Changes"
2. Wait for auto-deploy to complete (2-3 min)
3. Check logs for: `Environment: production`
4. Check logs for: `Connected to Pre-Prod Database`

### 2. Check Database Connection

The server logs should show:
```
✅ Database connections established
{
  "environment": "production",
  "mongodb": true,
  "redis": true
}
```

### 3. Test Health Endpoint

```bash
curl https://karvia-business-1.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "Karvia Business API Server",
  "version": "1.0.0",
  "environment": "production",
  "database": {
    "mongodb": {
      "connected": true,
      "database": "karvia_business_preprod"
    }
  }
}
```

### 4. Test Login

```bash
curl -X POST https://karvia-business-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

Should return JWT token if user exists in preprod database.

## Common Issues

### Issue 1: 401 Unauthorized on Login

**Cause:** User doesn't exist in preprod database or wrong password

**Fix:**
```bash
# Run sync script to copy users from prod to preprod
node server/scripts/sync-prod-to-preprod.js

# Or create a test user
node server/scripts/update-user-role.js test@example.com EXECUTIVE
```

### Issue 2: 500 Internal Server Error

**Cause:** Missing environment variables or wrong database URI

**Fix:**
1. Check Render env vars match the list above
2. Verify MONGODB_URI ends with `/karvia_business_preprod`
3. Check Render logs for actual error message

### Issue 3: Connected to Wrong Database

**Cause:** MONGODB_URI still points to production database

**Fix:**
1. Update MONGODB_URI in Render dashboard
2. Ensure it ends with `/karvia_business_preprod` not `/karvia_business`
3. Redeploy

## Database URI Comparison

**PRODUCTION:**
```
mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business?retryWrites=true&w=majority
```

**PREPROD (use this):**
```
mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business_preprod?retryWrites=true&w=majority
```

Notice the difference: `karvia_business` vs `karvia_business_preprod`

## Current Preprod Users (after sync)

The preprod database now has 60 users from production. You can log in with any user that exists in production.

To check which users exist:
```bash
node server/scripts/check-preprod-users.js
```

## Testing Workflow

1. **Login** with a prod user (synced to preprod)
2. **Navigate** to Planning page
3. **Create** a plan:
   - Select objective
   - Select KR
   - Set timeline (e.g., 3 weeks)
   - Choose owner
   - Generate plan
   - Create goals
4. **Verify** in MongoDB:
   - Check `goals` collection (should have 1 quarterly + N weekly)
   - Check `tasks` collection (should have 3N tasks)
5. **View** in Dashboard to see hierarchy

## Troubleshooting Login Issues

If you can't remember a production user's password:

1. **Option A:** Use script to check users
   ```bash
   node server/scripts/check-preprod-users.js
   ```

2. **Option B:** Create new test user via signup
   - Go to: https://karvia-business-1.onrender.com/pages/signup.html
   - Create account with test credentials
   - Login with those credentials

3. **Option C:** Update existing user's role
   ```bash
   node server/scripts/update-user-role.js email@example.com EXECUTIVE
   ```
