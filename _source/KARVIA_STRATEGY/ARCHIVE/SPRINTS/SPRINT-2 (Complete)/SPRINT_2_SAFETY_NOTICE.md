# 🚨 SPRINT 2 CRITICAL SAFETY NOTICE

**Date**: November 13, 2025
**Issue**: System environment variable overriding .env settings
**Resolution**: MUST unset MONGODB_URI before running any Sprint 2 code

---

## ⚠️ CRITICAL ISSUE DISCOVERED

### The Problem:
There's a system environment variable `MONGODB_URI` that points to the **PRODUCTION DATABASE** (`karvia_business`). This overrides the `.env` file settings, which could cause Sprint 2 development to accidentally modify production data!

### The Risk:
- Sprint 2 code could modify production database
- Goal model changes would affect live users
- Test data could pollute production

---

## ✅ SAFETY MEASURES IMPLEMENTED

### 1. Database Safety Check
**File**: `/server/config/database-safety.js`
- Automatically checks if using test database
- Throws error if production database detected
- Prevents accidental production modifications

### 2. Updated Configuration Files
- `.env` → Points to `karvia_business_test` ✅
- `.env.development` → Renamed to `.env.development.backup_sprint2` (disabled)
- `.env.backup_sprint2` → Backup of original settings

### 3. Safe Startup Script
**File**: `/start-sprint2-safe.sh`
- Unsets system environment variable
- Verifies test database configuration
- Provides clear instructions

---

## 📋 REQUIRED ACTIONS FOR ALL DEVELOPERS

### Before Running ANY Sprint 2 Code:

#### Option 1: Unset for Each Command
```bash
unset MONGODB_URI && node server/migrations/sprint2-goal-migration.js
unset MONGODB_URI && node server/tests/test-goal-hierarchy.js
unset MONGODB_URI && npm run dev
```

#### Option 2: Source the Safety Script
```bash
source ./start-sprint2-safe.sh
# Now all commands will use test database
node server/migrations/sprint2-goal-migration.js
```

#### Option 3: Start New Terminal Session
```bash
# In new terminal
unset MONGODB_URI
export MONGODB_URI=  # Clear it completely
# Now use normally
```

---

## 🔍 HOW TO VERIFY SAFETY

### Quick Check:
```bash
# This will tell you which database is configured
unset MONGODB_URI && node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI.includes('test') ? '✅ TEST DB' : '❌ WRONG DB');"
```

### Full Safety Check:
```bash
unset MONGODB_URI && node -e "require('./server/config/database-safety');"
```

Should output:
```
✅ Database Safety Check Passed
📊 Using: karvia_business_test (Safe for Sprint 2 development)
```

---

## 🚫 WHAT NOT TO DO

1. **NEVER** run Sprint 2 code without checking database first
2. **NEVER** set MONGODB_URI as system environment variable during Sprint 2
3. **NEVER** use production database for testing
4. **NEVER** skip the safety checks

---

## 📊 DATABASE STATUS

| Database | Purpose | Status |
|----------|---------|--------|
| `karvia_business` | PRODUCTION | ⚠️ DO NOT USE |
| `karvia_business_test` | Sprint 2 Development | ✅ USE THIS |

---

## 🔧 TROUBLESHOOTING

### If Safety Check Fails:
```bash
# 1. Unset environment variable
unset MONGODB_URI

# 2. Verify .env file
grep MONGODB_URI .env

# 3. Should show:
# MONGODB_URI=...karvia_business_test...
```

### If Still Pointing to Production:
```bash
# 1. Check for system variable
printenv | grep MONGODB

# 2. If found, unset it
unset MONGODB_URI

# 3. Check other .env files
ls -la .env*

# 4. Ensure only .env is active
```

---

## 📝 SPRINT 2 COMMAND REFERENCE

### All Sprint 2 commands MUST be run with `unset MONGODB_URI`:

```bash
# Setup test data
unset MONGODB_URI && node server/tests/setup-test-data.js

# Run migration
unset MONGODB_URI && node server/migrations/sprint2-goal-migration.js

# Test hierarchy
unset MONGODB_URI && node server/tests/test-goal-hierarchy.js

# Start development server
unset MONGODB_URI && npm run dev

# Run any tests
unset MONGODB_URI && npm test
```

---

## ⚠️ PRODUCTION DEPLOYMENT NOTE

When Sprint 2 is ready for production:
1. The Goal model changes must be applied to production code
2. Migration must be run on `karvia_business` database
3. Follow `SPRINT_2_PRODUCTION_MIGRATION.md` exactly
4. BACKUP production database first!

---

**REMEMBER**: Always verify you're using `karvia_business_test` before running Sprint 2 code!

**Safety First**: When in doubt, run the safety check!

---

*This notice is critical for all Sprint 2 development. Share with all team members.*