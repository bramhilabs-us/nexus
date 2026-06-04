# 🔧 WEEK 0: PREREQUISITES

**Duration**: 5 Days (BLOCKING)
**Status**: Must Complete Before MVP Week 1
**Team**: Engineering Lead + 2-3 Engineers

---

## ⚠️ CRITICAL: THIS IS BLOCKING

**MVP Week 1 cannot start until all Week 0 tasks are complete.**

Week 0 resolves technical debt and establishes the foundation for:
- Shared models architecture (decouple engines)
- Feature flags (standalone vs iBrain modes)
- Docker deployment (production-ready)
- Security hardening (no hard-coded secrets)

---

## 📋 WHAT'S IN THIS FOLDER

| Document | Purpose | Estimated Reading Time |
|----------|---------|----------------------|
| **WEEK_0_MIGRATION_GUIDE.md** | Complete 5-day migration plan | 30 min |
| **STANDALONE_MODE_CONFIGURATION.md** | Feature flags & deployment modes | 20 min |

---

## 🎯 WEEK 0 OBJECTIVES

### **Day 1-2: Shared Models Migration**
Create `@karvia/shared-models` package to decouple engines from server models.

**Why This Matters**:
- Engines currently import `../../server/models` (tight coupling)
- External party can't deploy engines independently
- iBrain integration requires clear boundaries
- Prevents schema drift across services

**What You'll Do**:
- Setup npm workspaces
- Create `packages/shared-models/` with Business, User, Objective, etc.
- Create new models: Goal, Task, Invitation
- Update all 6 engines to use shared package
- Remove all `../../server/models` imports

**Deliverable**: `@karvia/shared-models@1.0.0` package, all engines using it

---

### **Day 3-4: Feature Flags & Standalone Mode**
Implement feature flag system for optional dependencies (OpenAI, Redis, iBrain).

**Why This Matters**:
- Karvia must work without iBrain (core product requirement)
- OpenAI is optional (customer provides API key)
- Redis can fallback to in-memory cache
- Email can fallback to manual provisioning

**What You'll Do**:
- Create `FeatureFlagService` (server/services/feature-flags.js)
- Implement OpenAI config with template fallback
- Implement Redis cache with in-memory fallback
- Implement iBrain config with webhook bypass
- Create `.env.standalone` template
- Create `docker-compose.standalone.yml`

**Deliverable**: Platform runs in 3 modes (Full Stack, Standalone, Hybrid)

---

### **Day 5: Docker & Security**
Fix Docker configuration and remove all hard-coded secrets.

**Why This Matters**:
- Current Dockerfile has bugs (engine package.json paths wrong)
- Hard-coded JWT secrets in codebase (security risk)
- docker-compose healthchecks missing (startup failures)
- External party needs one-command deployment

**What You'll Do**:
- Fix `Dockerfile.engines` (shared-models copy)
- Fix `docker-compose.yml` (remove invalid volumes, add healthchecks)
- Create `scripts/generate-secrets.sh`
- Remove all hard-coded secrets
- Add config validation (fail-fast if secrets missing)

**Deliverable**: `docker-compose up` works, no hard-coded secrets

---

## ✅ ACCEPTANCE CRITERIA

Week 0 is complete when ALL of these are true:

### **Shared Models**
- [ ] `packages/shared-models/` directory exists
- [ ] All models exported from `index.js`
- [ ] Goal, Task, Invitation models implemented
- [ ] All 6 engines have `@karvia/shared-models` in package.json
- [ ] No `require('../../server/models')` in codebase
- [ ] `npm test --workspace=@karvia/shared-models` passes

### **Feature Flags**
- [ ] `server/services/feature-flags.js` exists
- [ ] `FEATURE_OPENAI_ENABLED` toggle works
- [ ] `FEATURE_REDIS_ENABLED` toggle works
- [ ] `FEATURE_IBRAIN_ENABLED` toggle works
- [ ] `FEATURE_EMAIL_ENABLED` toggle works
- [ ] Template fallback works when OpenAI disabled
- [ ] In-memory cache works when Redis disabled

### **Deployment**
- [ ] `docker-compose.yml` builds all services
- [ ] `docker-compose.standalone.yml` works (MongoDB only)
- [ ] All healthchecks pass
- [ ] No hard-coded secrets in codebase
- [ ] `.env.example` created with all required vars
- [ ] `scripts/generate-secrets.sh` creates valid `.env`

### **Testing**
- [ ] Full stack mode tested (all services)
- [ ] Standalone mode tested (MongoDB only)
- [ ] Hybrid mode tested (some services)
- [ ] CI/CD pipeline updated for workspaces
- [ ] All engines start successfully

---

## 🚀 GETTING STARTED

### **Step 1: Read the Guides**
1. Read [WEEK_0_MIGRATION_GUIDE.md](./WEEK_0_MIGRATION_GUIDE.md) (30 min)
2. Read [STANDALONE_MODE_CONFIGURATION.md](./STANDALONE_MODE_CONFIGURATION.md) (20 min)

### **Step 2: Setup Your Environment**
```bash
cd /path/to/karvia_business

# Install dependencies
npm install

# Generate secrets
./scripts/generate-secrets.sh

# Verify .env created
ls -la .env
```

### **Step 3: Execute Day by Day**
Follow WEEK_0_MIGRATION_GUIDE.md exactly:
- Day 1: Setup workspaces
- Day 2: Migrate models
- Day 3: Update engines
- Day 4: Feature flags
- Day 5: Docker & security

### **Step 4: Validate**
```bash
# Test shared models
npm test --workspace=@karvia/shared-models

# Test engines use shared models
grep -r "require('../../server/models" engines/
# Should return: nothing (no matches)

# Test Docker Compose
docker-compose down
docker-compose build
docker-compose up

# Test standalone mode
docker-compose -f docker-compose.standalone.yml up
```

---

## 🔍 COMMON ISSUES

### **Issue: npm workspaces not recognized**
**Solution**: Ensure root `package.json` has:
```json
{
  "workspaces": [
    "packages/*",
    "engines/*",
    "server"
  ]
}
```

### **Issue: Engines can't find shared-models**
**Solution**: Run from root:
```bash
npm install
```
This creates symlinks in each engine's `node_modules/@karvia/shared-models`

### **Issue: Docker build fails**
**Solution**: Check Dockerfile.engines line 18 - should copy shared-models first:
```dockerfile
COPY packages/shared-models ./packages/shared-models
WORKDIR /app/packages/shared-models
RUN npm ci --production
```

### **Issue: Secrets validation fails**
**Solution**: Run:
```bash
./scripts/generate-secrets.sh
# Then restart services
docker-compose restart
```

---

## 📊 PROGRESS TRACKING

Use this checklist to track Week 0 progress:

**Day 1-2: Shared Models**
- [ ] Day 1 AM: Setup npm workspaces
- [ ] Day 1 PM: Create shared-models package
- [ ] Day 2 AM: Implement Goal, Task, Invitation models
- [ ] Day 2 PM: Test shared-models package

**Day 3: Engine Migration**
- [ ] Day 3 AM: Update IAM, Assessment, Planner engines
- [ ] Day 3 PM: Update Scoring, Observer, Tracking engines
- [ ] Day 3 EOD: Verify no `../../server/models` imports

**Day 4: Feature Flags**
- [ ] Day 4 AM: Implement FeatureFlagService
- [ ] Day 4 PM: Implement all config services (OpenAI, Redis, iBrain)
- [ ] Day 4 EOD: Test standalone mode

**Day 5: Docker & Security**
- [ ] Day 5 AM: Fix Dockerfiles
- [ ] Day 5 PM: Remove hard-coded secrets
- [ ] Day 5 EOD: Test full deployment

---

## 🎯 DELIVERABLES

At the end of Week 0, you should have:

1. **Code Changes**:
   - `packages/shared-models/` package (new)
   - All engines updated to use shared models
   - `server/services/feature-flags.js` (new)
   - All config services (OpenAI, Redis, iBrain)
   - Fixed Dockerfiles

2. **Configuration**:
   - `.env.example` template
   - `.env.standalone` template
   - `docker-compose.standalone.yml`
   - `scripts/generate-secrets.sh`

3. **Documentation**:
   - Updated README.md with deployment modes
   - Week 0 completion report

4. **Testing**:
   - All workspace tests passing
   - Docker Compose tested (full + standalone)
   - No security vulnerabilities

---

## ⏭️ NEXT STEPS

Once Week 0 is complete:

1. **Checkpoint Meeting**: Engineering lead reviews acceptance criteria
2. **Sign-off**: Product owner approves Week 0 completion
3. **Start MVP Week 1**: Begin Sprint 1 (Goals + Tasks + OpenAI)

**Do NOT proceed to MVP Week 1 until ALL Week 0 acceptance criteria are met.**

---

## 📞 SUPPORT

If you encounter blockers during Week 0:

1. **Check the guides**: Re-read WEEK_0_MIGRATION_GUIDE.md
2. **Check common issues**: See section above
3. **Review code**: Look at existing engine code for patterns
4. **Ask for help**: Engineering lead or team

---

**Last Updated**: October 1, 2025
**Estimated Effort**: 5 days (1 week with buffer)
**Status**: Ready to Execute
