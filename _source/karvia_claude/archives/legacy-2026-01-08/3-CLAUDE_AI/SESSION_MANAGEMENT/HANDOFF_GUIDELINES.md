# 📦 Claude Handoff Guidelines

**Purpose**: Guidelines for creating sprint and release handoffs
**Created**: November 5, 2025
**Location**: `/KARVIA_STRATEGY/3-DELIVERY/handoffs/`

---

## 🎯 When to Create a Handoff

Create a handoff document when:
- ✅ Completing a sprint (weekly)
- ✅ Finishing a major feature
- ✅ Preparing for deployment
- ✅ Transitioning to another developer
- ✅ Reaching a project milestone
- ✅ Before taking a break from development

---

## 📋 Required Handoff Documents

Each handoff **MUST** contain these 6 documents:

### 1. HANDOFF_SUMMARY.md
```markdown
# Sprint/Release Handoff Summary
- Executive Summary (3-5 bullets)
- Completion Percentage
- What Was Completed
- What's Remaining
- Critical Issues
- Next Steps
```

### 2. TECHNICAL_SPECS.md
```markdown
# Technical Specifications
- Architecture Changes
- Database Updates
- API Modifications
- Frontend Components
- Integration Points
- Performance Metrics
```

### 3. TESTING_REPORT.md
```markdown
# Testing Report
- Test Coverage %
- Passed/Failed/Skipped
- Known Bugs (P0, P1, P2)
- Performance Results
- Browser Compatibility
```

### 4. FILES_MODIFIED.md
```markdown
# Files Modified
- New Files (with line counts)
- Modified Files
- Deleted Files
- Configuration Changes
- Dependencies Added
```

### 5. DEPLOYMENT_GUIDE.md (if applicable)
```markdown
# Deployment Guide
- Prerequisites
- Environment Setup
- Step-by-Step Instructions
- Verification Steps
- Rollback Procedure
```

### 6. CURRENT_STATE_TREE.md ⭐ MOST IMPORTANT
```markdown
# Current System State Tree

## 🌳 Current State with Links

### Documentation
├── [SYSTEM_OVERVIEW.md](link) - System context
├── [FEATURE_CATALOG.md](link) - Feature status
└── [MASTER_DEV_LIST.md](link) - Progress tracking

### Implementation
├── Backend (X% complete)
│   ├── Component ✅
│   └── Component ❌
└── Frontend (Y% complete)
    ├── Component ✅
    └── Component ❌

[Include actual links to all relevant files]
```

---

## 🔧 How to Create a Handoff

### Step 1: Prepare Environment
```bash
# Verify environment is clean
node .claude/verify-environment.js

# Run all tests
npm test

# Check for uncommitted changes
git status
```

### Step 2: Create Handoff Structure
```bash
# Create folder for handoff
SPRINT_NAME="SPRINT-1"  # or "PRE-SPRINT", "BETA-RELEASE", etc.
HANDOFF_DIR="/Users/sagarrs/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/3-DELIVERY/handoffs/$SPRINT_NAME"
mkdir -p $HANDOFF_DIR
```

### Step 3: Generate Content

#### Get file changes
```bash
# List new/modified files
git diff --name-status HEAD~20 > $HANDOFF_DIR/git-changes.txt

# Get line counts for new files
find . -name "*.js" -o -name "*.html" -o -name "*.css" -newer .gitignore | xargs wc -l
```

#### Run test coverage
```bash
npm test -- --coverage > $HANDOFF_DIR/test-coverage.txt
```

#### Check current status
```bash
# Review master documents
cat KARVIA_STRATEGY/3-DELIVERY/MASTER_DEV_LIST.md | grep "Status:"
cat KARVIA_STRATEGY/3-DELIVERY/MASTER_ISSUES_LIST.md | grep "P0"
```

### Step 4: Create Documents

Use the templates and create all 6 required documents:
1. Start with HANDOFF_SUMMARY.md
2. Fill in TECHNICAL_SPECS.md with architecture details
3. Add test results to TESTING_REPORT.md
4. Document all file changes in FILES_MODIFIED.md
5. If deploying, create DEPLOYMENT_GUIDE.md
6. **IMPORTANT**: Create CURRENT_STATE_TREE.md with working links

### Step 5: Review and Tag

```bash
# Review all documents
ls -la $HANDOFF_DIR/

# Verify links in CURRENT_STATE_TREE.md work
# Check for sensitive information
# Ensure no passwords or keys included

# Create git tag
git add .
git commit -m "Handoff: $SPRINT_NAME complete"
git tag -a "handoff-$SPRINT_NAME" -m "Handoff for $SPRINT_NAME"
git push origin --tags
```

---

## 🌳 Current State Tree Template

The CURRENT_STATE_TREE.md is the most important document. Here's the template:

```markdown
# 🌳 Current System State - [Sprint Name]

**Date**: [Date]
**Overall Completion**: X%
**Sprint**: [Sprint Name]

## 📊 System Overview
\`\`\`
Karvia Business Platform
├── Overall: X% Complete
├── Backend: Y% Complete
├── Frontend: Z% Complete
└── Testing: N% Coverage
\`\`\`

## 🏗️ Architecture & Documentation

### Core Documents
\`\`\`
├── [SYSTEM_OVERVIEW.md](../../../1-PRODUCT/SYSTEM_OVERVIEW.md)
├── [PRODUCT_ARCHITECTURE.md](../../../1-PRODUCT/PRODUCT_ARCHITECTURE.md)
└── [FEATURE_CATALOG.md](../../../1-PRODUCT/FEATURE_CATALOG.md)
\`\`\`

## 💻 Implementation Status

### Backend (X% Complete)
\`\`\`
server/
├── models/ (Y/Z Complete)
│   ├── ✅ Model1.js
│   └── ❌ Model2.js
└── routes/ (A/B Complete)
    ├── ✅ Route1.js
    └── ⚠️ Route2.js (partial)
\`\`\`

### Frontend (X% Complete)
\`\`\`
client/
├── pages/ (Y/Z Pages)
│   ├── ✅ page1.html
│   └── ❌ page2.html
└── js/ (A/B Files)
    ├── ✅ script1.js
    └── ⚠️ script2.js (needs work)
\`\`\`

## 🔗 Quick Links
- [MASTER_DEV_LIST.md](../../MASTER_DEV_LIST.md)
- [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md)
- [Current Sprint Plan](../../1-SPRINTS/current/)

## 📊 Summary Dashboard
| Component | Status | Progress |
|-----------|--------|----------|
| Backend | 🟢 | X% |
| Frontend | 🟡 | Y% |
| Testing | 🔴 | Z% |
\`\`\`

---

## 📍 Handoff Locations

All handoffs are stored in:
```
/KARVIA_STRATEGY/3-DELIVERY/handoffs/
├── PRE-SPRINT/     # ✅ Complete (Nov 5, 2025)
├── SPRINT-1/       # Current sprint
├── SPRINT-2/       # Next sprint
└── BETA-RELEASE/   # December 2025
```

---

## ✅ Handoff Checklist

Before marking handoff complete:

- [ ] All 6 documents created
- [ ] CURRENT_STATE_TREE.md has working links
- [ ] No sensitive data included
- [ ] Test coverage documented
- [ ] Known issues listed
- [ ] Next steps defined
- [ ] Git tagged appropriately
- [ ] Team notified

---

## 🚨 Important Rules

1. **NEVER** include:
   - Real passwords
   - Production API keys
   - Customer data
   - Internal IPs

2. **ALWAYS** include:
   - Current completion percentages
   - Links to source files
   - Known issues and blockers
   - Clear next steps

3. **VERIFY** before committing:
   - All links work
   - No typos in technical specs
   - File counts are accurate
   - Test results are current

---

## 📞 Questions?

- Check existing handoffs in `/KARVIA_STRATEGY/3-DELIVERY/handoffs/`
- Review PRE-SPRINT handoff as example
- Contact team lead for clarification

---

**Guidelines Version**: 1.0
**Last Updated**: November 5, 2025
**Next Review**: After Sprint 1 handoff