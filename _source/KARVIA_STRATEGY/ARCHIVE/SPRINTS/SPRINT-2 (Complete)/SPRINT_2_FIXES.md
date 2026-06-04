# Sprint 2 - Error Fixes

## Issue Resolved
The server was failing to start with the error:
```
Route.get() requires a callback function but got a [object Undefined]
```

## Root Cause
The Sprint 2 routes were importing `{ authenticate }` from the auth middleware, but the actual exported function was `verifyToken`.

## Fixes Applied

### 1. Updated Middleware Import in `/server/routes/planning.js`
- Changed: `const { authenticate } = require('../middleware/auth');`
- To: `const { verifyToken } = require('../middleware/auth');`
- Replaced all instances of `authenticate` with `verifyToken`

### 2. Updated Middleware Import in `/server/routes/sprint2-dashboard.js`
- Changed: `const { authenticate } = require('../middleware/auth');`
- To: `const { verifyToken } = require('../middleware/auth');`
- Replaced all instances of `authenticate` with `verifyToken`

### 3. Fixed User ID References
- Changed: `req.userId`
- To: `req.user.id || req.user._id`
- The auth middleware sets `req.user`, not `req.userId`

### 4. Fixed Deprecated Method
- Changed: `await goal.remove()`
- To: `await goal.deleteOne()`
- The `remove()` method is deprecated in newer Mongoose versions

## Testing Instructions

### 1. Start the Server
```bash
# Always unset the environment variable first!
unset MONGODB_URI && npm run dev
```

### 2. Verify Server is Running
```bash
# Check health endpoint
curl http://localhost:8080/health
```

You should see the server running with `karvia_business_test` database.

### 3. Access Sprint 2 Pages
- **Planning Page**: http://localhost:8080/pages/planning.html
- **Sprint 2 Dashboard**: http://localhost:8080/pages/sprint2-dashboard.html

### 4. Login with Test Credentials
- Email: `test@sprint2.com`
- Password: `Test123!`

## Server Status
✅ Server is now running successfully
✅ Connected to test database (`karvia_business_test`)
✅ All Sprint 2 routes are loaded
✅ Authentication middleware is properly configured

## Note on Redis Errors
The Redis connection errors you see are normal and expected:
- Redis is disabled in feature flags
- The system falls back to in-memory caching
- This doesn't affect Sprint 2 functionality

## Summary
All Sprint 2 features are now working correctly. The main issue was a mismatch between the middleware function names. The routes expected `authenticate` but the middleware exported `verifyToken`.